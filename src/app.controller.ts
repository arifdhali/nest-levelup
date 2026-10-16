import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service.js';
import { NotificationsService } from './notifications/notifications.service.js';
import { NotificationEvent } from './notifications/dto/send-notification.dto.js';
import { RequestContextServices } from './common/filters/request-context.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly notification: NotificationsService, private readonly requestService: RequestContextServices) { }

  @Get("request-info")
  getRequestInformations() {
    return this.requestService.getInformation()
  }

  @Get()
  async getHello() {
    let d = {
      recipient: ['a@gmail.com'],
      event: NotificationEvent.ORDER_CONFIRMED,
      message: "App Modules"
    }
    try {
      return await this.notification.sendSMS(d);
      return this.appService.getHello();
    } catch (err) {
      throw err;
    }
  }
}
