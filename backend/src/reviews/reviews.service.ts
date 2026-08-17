import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  findForProduct(productId: string) {
    return this.reviewModel.find({ product: productId, approved: true }).sort({ createdAt: -1 });
  }

  findAll() {
    return this.reviewModel.find().sort({ createdAt: -1 });
  }

  async create(userId: string, userName: string, data: { product: string; rating: number; text: string }) {
    const review = await this.reviewModel.create({ ...data, user: userId, userName });
    await this.recalculateRating(data.product);
    return review;
  }

  private async recalculateRating(productId: string) {
    const reviews = await this.reviewModel.find({ product: productId, approved: true });
    const reviewCount = reviews.length;
    const rating = reviewCount
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount
      : 0;
    await this.productModel.findByIdAndUpdate(productId, { rating, reviewCount });
  }

  async remove(id: string) {
    const review = await this.reviewModel.findByIdAndDelete(id);
    if (!review) throw new NotFoundException('Review not found');
    await this.recalculateRating(review.product.toString());
    return { deleted: true };
  }
}
