import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ type: SchemaTypes.ObjectId, ref: 'Order', required: true })
  order: Types.ObjectId;

  @Prop({ required: true, default: 'COD' })
  method: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ enum: ['pending', 'paid', 'failed'], default: 'pending' })
  status: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
