import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WishlistService } from './wishlist.service';

@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
  constructor(private wishlistService: WishlistService) {}

  @Get()
  get(@Req() req: any) {
    return this.wishlistService.get(req.user.userId);
  }

  @Post('toggle')
  toggle(@Req() req: any, @Body() body: { productId: string }) {
    return this.wishlistService.toggle(req.user.userId, body.productId);
  }
}
