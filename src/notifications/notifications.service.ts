import { BadRequestException, ConflictException, Inject, Injectable, Optional, ServiceUnavailableException } from '@nestjs/common';
import { NotificationEvent, sendNotificationsDto } from './dto/send-notification.dto.js';
import { ConfigService } from '@nestjs/config';
import { EmailProvider } from './provider/Email.js';
import { SmsProvider } from './provider/Sms.js';
import type { NotificationModuleOptions } from './notification-module-options.interface.js';
import { NOTIFICATION_OPTIONS } from './notification.tokens.js';

@Injectable()
export class NotificationsService {

  constructor(
    private readonly configService: ConfigService,
    @Inject(NOTIFICATION_OPTIONS)
    private readonly options: NotificationModuleOptions,

    @Optional()
    private readonly emailProvider?: EmailProvider,

    @Optional()
    private readonly smsProvider?: SmsProvider
  ) { }


  private async isNotificationsEnabled(): Promise<boolean> {

    let isEnabled = this.configService.get<string>('NOTIFICATIONS_ENABLED')
    if (isEnabled?.toLowerCase() != 'true') {
      throw new BadRequestException("Notification is DISABLED.")
    }
    return true;
  }


  async sendEmail(body: sendNotificationsDto) {

    this.isNotificationsEnabled();
    if (!this.options.email || !this.emailProvider) {
      throw new BadRequestException('Email notifications are not enabled.')
    }
    let msg = body.message.trim();

    const subject: Record<NotificationEvent, string> = {
      [NotificationEvent.ORDER_CONFIRMED]: 'Order Confirmation',
      [NotificationEvent.PAYMENT_SUCCESS]: 'Payment Successful',
      [NotificationEvent.ORDER_DELIVERED]: 'Order Delivered',
    }

    const senderName = this.configService.get<string>('EMAIL_SENDER_NAME', "Test sender");


    let maxAttempt = 3;

    for (let attempt = 1; attempt <= maxAttempt; attempt++) {

      try {
        let result = await this.emailProvider.send(body.recipient, subject[body.event], msg, senderName);
        if (!result.accepted) {
          throw new Error('Email provider rejected the message.');
        }

        return {
          status: 'SENT',
          event: body.event,
          recipient: body.recipient,
          messageId: result.messageId,
        };
      } catch (err) {
        if (attempt == maxAttempt) {
          throw new ServiceUnavailableException("Provider failed! its reaches the MAX_LIMIT")
        }
      }

    }



  }

  async sendSMS(body: any) {

    this.isNotificationsEnabled();

    if (!this.options.sms || !this.smsProvider) {
      throw new BadRequestException('SMS notifications are not enabled.')
    }

    let smsRecipents = [11111111, 2222222, 33333, 44444]
    let maxAttempt = 3;

    for (let attempt = 1; attempt <= maxAttempt; attempt++) {
      try {

        let result = await this.smsProvider.send(smsRecipents, "Order", "Hello test sms");

        if (!result.accepted) {
          throw new Error('SMS provider rejected the message.');
        }

        return {
          status: 'SENT',
          event: body.event,
          recipient: smsRecipents,
          messageId: result.messageId,
        };
      } catch (error) {
        console.log(attempt, maxAttempt)
        if (attempt == maxAttempt) {
          throw new ServiceUnavailableException("Provider failed to sent")
        }
      }
    }


  }

}

