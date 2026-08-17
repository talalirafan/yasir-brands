import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { ContactDto } from './dto/contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private notificationsService: NotificationsService) {}

  @Post()
  async submit(@Body() dto: ContactDto) {
    await this.notificationsService.notifyContactMessage(dto);
    return { success: true };
  }
}
