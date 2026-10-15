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
        try {

            await this.$connect()
            await this.$queryRaw`SELECT 1`
            console.log('✅ MySQL connected successfully through Prisma');
        } catch (error) {

            throw error;
        }

    }
    async onModuleDestroy() {

        try {

        } catch (err) {
            await this.$disconnect();
            console.log('MySQL DISCONNECTED ');
        }

    }
}
