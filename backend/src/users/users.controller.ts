import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  getProfile(@Req() req: any) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('me')
  updateProfile(@Req() req: any, @Body() body: any) {
    return this.usersService.updateProfile(req.user.userId, body);
  }
}
