import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller.js";
import { AuthServices } from "./auth.service.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { AuthGuard } from "./guard/auth.guard.js";


@Module({
    imports: [
        PrismaModule,
        JwtModule.register({
            secret: "development-secret",
            signOptions: {
                expiresIn: "15m",
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthServices, AuthGuard],
    exports: [AuthGuard, JwtModule]
})

export class AuthModule { }