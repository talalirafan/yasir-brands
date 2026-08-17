import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, ORDER_STATUSES } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from '../notifications/notifications.service';

const DELIVERY_FEE = 250;
const FREE_DELIVERY_THRESHOLD = 5000;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private notificationsService: NotificationsService,
  ) {}

  private generateOrderNumber() {
    return `YSR${Date.now().toString().slice(-8)}`;
  }

  async create(userId: string, dto: CreateOrderDto) {
    const items: { product: any; name: string; price: number; qty: number }[] = [];
    let subtotal = 0;

    for (const item of dto.items) {
      const product = await this.productModel.findById(item.product);
      if (!product) throw new NotFoundException(`Product ${item.product} not found`);
      if (product.stock < item.qty) {
        throw new BadRequestException(`${product.name} is out of stock`);
      }
      items.push({ product: product._id, name: product.name, price: product.price, qty: item.qty });
      subtotal += product.price * item.qty;
    }

    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = subtotal + delivery;

    const order = await this.orderModel.create({
      orderNumber: this.generateOrderNumber(),
      user: userId,
      items,
      subtotal,
      delivery,
      total,
      fullName: dto.fullName,
      phone: dto.phone,
      city: dto.city,
      area: dto.area,
      address: dto.address,
      postalCode: dto.postalCode,
      notes: dto.notes,
      paymentMethod: dto.paymentMethod || 'COD',
      senderNumber: dto.senderNumber,
      transactionId: dto.transactionId,
      status: 'Pending',
    });

    for (const item of dto.items) {
      await this.productModel.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    await this.cartModel.findOneAndUpdate({ user: userId }, { items: [] });

    // Fire-and-forget: don't block order response on notification delivery.
    this.notificationsService.notifyNewOrder(order).catch(() => {});

    return order;
  }

  findAllForUser(userId: string) {
    return this.orderModel.find({ user: userId }).sort({ createdAt: -1 });
  }

  findAll() {
    return this.orderModel.find().sort({ createdAt: -1 });
  }

  async findOne(id: string) {
    const order = await this.orderModel.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }

  async updateStatus(id: string, status: string) {
    if (!ORDER_STATUSES.includes(status as any)) {
      throw new BadRequestException('Invalid status');
    }
    const order = await this.orderModel.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
}
