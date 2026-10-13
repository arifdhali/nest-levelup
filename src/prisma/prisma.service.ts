import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { ConfigService } from '@nestjs/config';
import { createPrismaClient } from './prisma-client.factory.js';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor(configService: ConfigService) {
        const client = createPrismaClient(configService)
        super({ adapter: client });
    }
    async onModuleInit() {
        await this.$connect()
        console.log('✅ MySQL connected successfully through Prisma');

    }
    async onModuleDestroy() {

        await this.$disconnect();
        console.log('MySQL DISCONNECTED ');

    }
}
