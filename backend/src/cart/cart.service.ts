import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) cart = await this.cartModel.create({ user: userId, items: [] });
    return cart;
  }

  async getCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    return cart.populate('items.product');
  }

  async addItem(userId: string, productId: string, qty = 1) {
    const cart = await this.getOrCreateCart(userId);
    const existing = cart.items.find((i) => i.product.toString() === productId);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.items.push({ product: productId as any, qty });
    }
    await cart.save();
    return cart.populate('items.product');
  }

  async updateItem(userId: string, productId: string, qty: number) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items
      .map((i) => (i.product.toString() === productId ? { ...i, qty } : i))
      .filter((i) => i.qty > 0);
    await cart.save();
    return cart.populate('items.product');
  }

  async removeItem(userId: string, productId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = cart.items.filter((i) => i.product.toString() !== productId);
    await cart.save();
    return cart.populate('items.product');
  }

  async clearCart(userId: string) {
    const cart = await this.getOrCreateCart(userId);
    cart.items = [];
    await cart.save();
    return cart;
  }
}
