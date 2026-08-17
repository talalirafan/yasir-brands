import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';
import { Review, ReviewSchema } from './schemas/review.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: Product.name, schema: ProductSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService],
  exports: [MongooseModule, ReviewsService],
})
export class ReviewsModule {}
