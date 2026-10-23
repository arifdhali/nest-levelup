import { MiddlewareConsumer, Module, OnModuleDestroy, OnModuleInit, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module.js';
import { UserModule } from './users/users.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { RequestMiddleware } from './common/middleware/request-id.middleware.js';
import { NotificationsModule } from './notifications/notifications.module.js';
import { RequestContextServices } from './common/filters/request-context.service.js';
import { RequestLoggerInterceptor } from './common/interceptor/request-logging.interceptor.js';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { CacheModule } from '@nestjs/cache-manager';




@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,

    }),
    AuthModule,
    ProductsModule,
    UserModule,
    OrdersModule,
    NotificationsModule.register({
      email: true,
      sms: true
    }),
    CacheModule.register({
      isGlobal: true,
    })
  ],
  controllers: [AppController],
  providers: [AppService, RequestContextServices,
    {
      provide: APP_INTERCEPTOR,
      useClass: RequestLoggerInterceptor
    }
  ],


})
export class AppModule implements OnModuleInit, OnModuleDestroy {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes({
      path: "*",
      method: RequestMethod.ALL
    })
  }

  onModuleInit() {
    console.log('check all the pending task before other module')



  }
  async onModuleDestroy(): Promise<void> {
    console.log('1. onModuleDestroy: Cleaning resources...');
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('2. onModuleDestroy: Cleanup completed');
  }

}
