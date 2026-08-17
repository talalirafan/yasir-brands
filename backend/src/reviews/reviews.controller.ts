import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReviewsService } from './reviews.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('product/:productId')
  findForProduct(@Param('productId') productId: string) {
    return this.reviewsService.findForProduct(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Req() req: any, @Body() body: { product: string; rating: number; text: string }) {
    return this.reviewsService.create(req.user.userId, req.user.email, body);
  }
}
