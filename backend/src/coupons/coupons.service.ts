import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from './schemas/coupon.schema';

@Injectable()
export class CouponsService {
  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  findAll() {
    return this.couponModel.find().sort({ createdAt: -1 });
  }

  create(data: Partial<Coupon>) {
    return this.couponModel.create({ ...data, code: data.code?.toUpperCase() });
  }

  async update(id: string, data: Partial<Coupon>) {
    const coupon = await this.couponModel.findByIdAndUpdate(id, data, { new: true });
    if (!coupon) throw new NotFoundException('Coupon not found');
    return coupon;
  }

  async remove(id: string) {
    const coupon = await this.couponModel.findByIdAndDelete(id);
    if (!coupon) throw new NotFoundException('Coupon not found');
    return { deleted: true };
  }

  async validate(code: string, subtotal: number) {
    const coupon = await this.couponModel.findOne({ code: code.toUpperCase() });
    if (!coupon || !coupon.active) {
      throw new BadRequestException('Invalid or inactive coupon code');
    }
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('This coupon has expired');
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      throw new BadRequestException(
        `This coupon requires a minimum order of Rs. ${coupon.minOrderValue}`,
      );
    }
    const discount =
      coupon.discountType === 'percent'
        ? Math.round((subtotal * coupon.discountValue) / 100)
        : coupon.discountValue;
    return {
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discount: Math.min(discount, subtotal),
    };
  }
}
