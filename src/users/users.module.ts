import { Module } from "@nestjs/common";
import { UsersController } from "./users.controller.js";
import { UserServices } from "./users.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [UsersController],
    providers: [UserServices]
})

export class UserModule { }