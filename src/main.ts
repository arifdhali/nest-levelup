import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { HTTPExceptionFilter } from './common/filters/HTTPExceptionFilter.js';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true
    }))
    // app.setGlobalPrefix("api")
    // app.enableShutdownHooks()

    await app.listen(process.env.PORT ?? 3000, process.env.HOST ?? "localhost");
    app.useGlobalFilters(new HTTPExceptionFilter())
    console.log(`server running on http://${process.env.HOST}:${process.env.PORT}`)
  } catch (error) {
    console.log('bootstrap error', error)
    process.exit(1)
  }
}
await bootstrap();
