import { BadRequestException, ConflictException, Injectable, ServiceUnavailableException } from '@nestjs/common';
import { NotificationEvent, sendNotificationsDto } from './dto/send-notification.dto.js';
import { ConfigService } from '@nestjs/config';
import { EmailProvider } from './provider/Email.js';

@Injectable()
export class NotificationsService {

  constructor(private readonly configService: ConfigService, private readonly emailProvider: EmailProvider) { }

  async send(body: sendNotificationsDto) {

    try {
      let isEnabled = this.configService.get<string>('NOTIFICATIONS_ENABLED')

      if (isEnabled?.toLowerCase() != 'true') {
        throw new BadRequestException("Notification is DISABLED.")
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
        } catch (error) {
          console.log(attempt, maxAttempt)
          if (attempt == maxAttempt) {
            throw new ServiceUnavailableException("Provider failed to sent")
          }
        }

      }

    } catch {

      throw new ServiceUnavailableException(
        'Unable to send the email notification.',
      );
    }

  }

}

