import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { EmailProvider } from './provider/Email.js';

@Module({
  imports: [],
  controllers: [NotificationsController],
  providers: [NotificationsService, EmailProvider],
  exports: [NotificationsService]
})
export class NotificationsModule { }
