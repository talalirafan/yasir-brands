import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles, RolesGuard } from '../auth/roles.guard';
import { AdminService } from './admin.service';
import { OrdersService } from '../orders/orders.service';
import { UsersService } from '../users/users.service';
import { ReviewsService } from '../reviews/reviews.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@Controller('admin')
export class AdminController {
  constructor(
    private adminService: AdminService,
    private ordersService: OrdersService,
    private usersService: UsersService,
    private reviewsService: ReviewsService,
  ) {}

  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  @Get('orders')
  getOrders() {
    return this.ordersService.findAll();
  }

  @Patch('orders/:id/status')
  updateOrderStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.ordersService.updateStatus(id, body.status);
  }

  @Get('customers')
  getCustomers() {
    return this.usersService.findAllWithOrderCounts();
  }

  @Get('reviews')
  getReviews() {
    return this.reviewsService.findAll();
  }

  @Delete('reviews/:id')
  removeReview(@Param('id') id: string) {
    return this.reviewsService.remove(id);
  }
}
