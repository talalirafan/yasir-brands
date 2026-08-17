import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
  ) {}

  create(orderId: string, amount: number, method = 'COD') {
    return this.paymentModel.create({ order: orderId, amount, method, status: 'pending' });
  }

  findForOrder(orderId: string) {
    return this.paymentModel.findOne({ order: orderId });
  }
}
