import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { sendNotificationsDto } from './dto/send-notification.dto.js';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) { }



  @Post("send")
  async send(@Body() body: sendNotificationsDto) {

    try {
      return await this.notificationsService.sendEmail(body);
    } catch (err) {
      throw err;
    }

  }

}
