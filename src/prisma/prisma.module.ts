import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  exports: [PrismaService],
  providers: [PrismaService]
})
export class PrismaModule { }
