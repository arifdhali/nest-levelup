import bcrypt from "bcrypt"
import { ConfigService } from "@nestjs/config";
import { PrismaClient } from "../src/generated/prisma/client.js";
import { createPrismaClient } from "../src/prisma/prisma-client.factory.js";


const configServe = new ConfigService(process.env)

const prisma = new PrismaClient({
    adapter: createPrismaClient(configServe)
})
async function main() {
    console.log('seed start')
    const password = await bcrypt.hash('Admin@12345', 12);
    const user = await prisma.user.upsert({
        where: {
            email: 'arif_new@example.com',
        },
        update: {},
        create: {
            name: 'Arif Dhali',
            email: 'arif_new@example.com',
            password,
            role: "user",
        },
    });
    await prisma.user.upsert({
        where: {
            email: 'admin@example.com',
        },
        update: {},
        create: {
            name: 'Admin N',
            email: 'admin@example.com',
            password,
            role: "admin",
            user_permission: [
                "update",
                "create",
                "read"
            ]
        },
    });
    await prisma.user.upsert({
        where: {
            email: 'superAdmin@example.com',
        },
        update: {},
        create: {
            name: 'Super Admin',
            email: 'superAdmin@example.com',
            password,
            role: "superAdmin",
            user_permission: [
                "update",
                "create",
                "read",
                "delete"
            ]
        },
    });

    console.log("Inserted user:", user);
}

main()
    .catch((e) => {
        console.log(e)
    })
    .finally(async () => {
        await prisma.$disconnect();
    });