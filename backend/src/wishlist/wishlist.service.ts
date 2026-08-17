import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';

@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
  ) {}

  private async getOrCreate(userId: string) {
    let wishlist = await this.wishlistModel.findOne({ user: userId });
    if (!wishlist) wishlist = await this.wishlistModel.create({ user: userId, products: [] });
    return wishlist;
  }

  async get(userId: string) {
    const wishlist = await this.getOrCreate(userId);
    return wishlist.populate('products');
  }

  async toggle(userId: string, productId: string) {
    const wishlist = await this.getOrCreate(userId);
    const exists = wishlist.products.some((p) => p.toString() === productId);
    wishlist.products = exists
      ? wishlist.products.filter((p) => p.toString() !== productId)
      : [...wishlist.products, new Types.ObjectId(productId)];
    await wishlist.save();
    return wishlist.populate('products');
  }
}
