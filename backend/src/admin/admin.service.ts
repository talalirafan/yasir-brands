import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';

@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
  ) {}

  async getStats() {
    const [totalProducts, totalOrders, pendingOrders, deliveredOrders, totalCustomers, totalReviews, salesAgg] =
      await Promise.all([
        this.productModel.countDocuments(),
        this.orderModel.countDocuments(),
        this.orderModel.countDocuments({ status: 'Pending' }),
        this.orderModel.countDocuments({ status: 'Delivered' }),
        this.userModel.countDocuments({ role: 'customer' }),
        this.reviewModel.countDocuments(),
        this.orderModel.aggregate([
          { $match: { status: { $ne: 'Cancelled' } } },
          { $group: { _id: null, total: { $sum: '$total' } } },
        ]),
      ]);

    return {
      totalProducts,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      totalCustomers,
      totalReviews,
      totalSales: salesAgg[0]?.total ?? 0,
    };
  }
}
