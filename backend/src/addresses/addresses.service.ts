import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Address, AddressDocument } from './schemas/address.schema';

@Injectable()
export class AddressesService {
  constructor(
    @InjectModel(Address.name) private addressModel: Model<AddressDocument>,
  ) {}

  findAllForUser(userId: string) {
    return this.addressModel.find({ user: userId });
  }

  create(userId: string, data: Partial<Address>) {
    return this.addressModel.create({ ...data, user: userId });
  }

  async update(userId: string, id: string, data: Partial<Address>) {
    const address = await this.addressModel.findOneAndUpdate(
      { _id: id, user: userId },
      data,
      { new: true },
    );
    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  async remove(userId: string, id: string) {
    const address = await this.addressModel.findOneAndDelete({ _id: id, user: userId });
    if (!address) throw new NotFoundException('Address not found');
    return { deleted: true };
  }
}
