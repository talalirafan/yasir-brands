import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CartService } from './cart.service';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  getCart(@Req() req: any) {
    return this.cartService.getCart(req.user.userId);
  }

  @Post('items')
  addItem(@Req() req: any, @Body() body: { productId: string; qty?: number }) {
    return this.cartService.addItem(req.user.userId, body.productId, body.qty ?? 1);
  }

  @Patch('items/:productId')
  updateItem(@Req() req: any, @Param('productId') productId: string, @Body() body: { qty: number }) {
    return this.cartService.updateItem(req.user.userId, productId, body.qty);
  }

  @Delete('items/:productId')
  removeItem(@Req() req: any, @Param('productId') productId: string) {
    return this.cartService.removeItem(req.user.userId, productId);
  }

  @Delete()
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.userId);
  }
}
