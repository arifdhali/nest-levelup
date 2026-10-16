import { DynamicModule, Module, OnModuleInit, Provider } from '@nestjs/common';
import { NotificationsService } from './notifications.service.js';
import { NotificationsController } from './notifications.controller.js';
import { EmailProvider } from './provider/Email.js';
import { SmsProvider } from './provider/Sms.js';
import { NotificationModuleOptions } from './notification-module-options.interface.js';
import { NOTIFICATION_OPTIONS } from './notification.tokens.js';

@Module({

})
export class NotificationsModule {

  static register(options: NotificationModuleOptions): DynamicModule {
    const providers: Provider[] = [];
    if (options.email) {
      providers.push(EmailProvider)
    }
    if (options.sms) {
      providers.push(SmsProvider)
    }
    console.log(providers)

    return {
      module: NotificationsModule,
      providers: [
        ...providers,
        {
          provide: NOTIFICATION_OPTIONS,
          useValue: options
        },
        NotificationsService
      ],

      exports: [NotificationsService]
    }

  }

}
