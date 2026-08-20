import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, ORDER_STATUSES } from './schemas/order.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { CouponsService } from '../coupons/coupons.service';
import { UsersService } from '../users/users.service';

const DELIVERY_FEE = 250;
const FREE_DELIVERY_THRESHOLD = 5000;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    private notificationsService: NotificationsService,
    private couponsService: CouponsService,
    private usersService: UsersService,
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

    let discount = 0;
    let couponCode: string | undefined;
    if (dto.couponCode) {
      const result = await this.couponsService.validate(dto.couponCode, subtotal);
      discount = result.discount;
      couponCode = result.code;
    }

    const delivery = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
    const total = Math.max(subtotal + delivery - discount, 0);

    const order = await this.orderModel.create({
      orderNumber: this.generateOrderNumber(),
      user: userId,
      items,
      subtotal,
      delivery,
      couponCode,
      discount,
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
    this.usersService
      .findById(userId)
      .then((customer) => this.notificationsService.notifyNewOrder(order, customer?.email))
      .catch(() => this.notificationsService.notifyNewOrder(order).catch(() => {}));

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

  /** Customer-initiated cancel — only allowed while the order hasn't shipped yet. */
  async cancelByCustomer(userId: string, id: string) {
    const order = await this.orderModel.findOne({ _id: id, user: userId });
    if (!order) throw new NotFoundException('Order not found');
    if (!['Pending', 'Confirmed'].includes(order.status)) {
      throw new BadRequestException('This order can no longer be cancelled');
    }

    order.status = 'Cancelled';
    await order.save();

    for (const item of order.items) {
      await this.productModel.findByIdAndUpdate(item.product, { $inc: { stock: item.qty } });
    }

    return order;
  }

  /** Customer-initiated return request — only for delivered orders. */
  async requestReturn(userId: string, id: string, reason: string) {
    const order = await this.orderModel.findOne({ _id: id, user: userId });
    if (!order) throw new NotFoundException('Order not found');
    if (order.status !== 'Delivered') {
      throw new BadRequestException('Only delivered orders can be returned');
    }

    order.status = 'Return Requested';
    order.notes = `${order.notes ? order.notes + ' | ' : ''}Return reason: ${reason}`;
    await order.save();
    return order;
  }
}
