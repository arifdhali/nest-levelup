import { ConfigService } from '@nestjs/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

export function createPrismaClient(configService: ConfigService) {
    const url = new URL(configService.getOrThrow<string>('DATABASE_URL'),);

    if (url.protocol !== 'mysql:') {
        throw new Error('DATABASE_URL must use the mysql:// protocol');
    }

    const adapter = new PrismaMariaDb({
        host: url.hostname,
        port: Number(url.port || 3306),
        user: decodeURIComponent(url.username),
        password: decodeURIComponent(url.password),
        database: decodeURIComponent(url.pathname.slice(1)),
    });

    return adapter;
}
