import { Body, Controller, Get, NotFoundException, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateOrderDto) {
    return this.ordersService.create(req.user.userId, dto);
  }

  @Get('my')
  findMine(@Req() req: any) {
    return this.ordersService.findAllForUser(req.user.userId);
  }

  @Get(':id')
  async findOne(@Req() req: any, @Param('id') id: string) {
    const order = await this.ordersService.findOne(id);
    if (req.user.role !== 'admin' && order.user.toString() !== req.user.userId) {
      // Behave like a 404 rather than leaking that the order exists.
      throw new NotFoundException('Order not found');
    }
    return order;
  }

  @Patch(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.ordersService.cancelByCustomer(req.user.userId, id);
  }

  @Patch(':id/return')
  requestReturn(@Req() req: any, @Param('id') id: string, @Body() body: { reason: string }) {
    return this.ordersService.requestReturn(req.user.userId, id, body.reason);
  }
}
