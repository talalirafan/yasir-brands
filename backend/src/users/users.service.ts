import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findById(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async updateProfile(id: string, data: Partial<User>) {
    const user = await this.userModel.findByIdAndUpdate(id, data, { new: true });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findAllWithOrderCounts() {
    return this.userModel.aggregate([
      { $match: { role: 'customer' } },
      {
        $lookup: {
          from: 'orders',
          localField: '_id',
          foreignField: 'user',
          as: 'orders',
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
          phone: 1,
          orderCount: { $size: '$orders' },
        },
      },
    ]);
  }
}
