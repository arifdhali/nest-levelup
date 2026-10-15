import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module.js';
import { UserModule } from './users/users.module.js';
import { OrdersModule } from './orders/orders.module.js';
import { LoggerMiddleware } from './common/middleware/Logger.middleware.js';
import { NotificationsModule } from './notifications/notifications.module.js';




@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true
    }),
    AuthModule,
    // ProductsModule,
    UserModule,
    OrdersModule,
    NotificationsModule
  ],
  controllers: [AppController],
  providers: [AppService],


})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*")
  }
}
