import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductService } from "./products.service.js";
import { AuthModule } from "../auth/auth.module.js";
import { PrismaModule } from "../prisma/prisma.module.js";
import { CustomThrottleGuard } from "../common/guard/custom-throttle.guard.js";



@Module({
    imports: [AuthModule, PrismaModule],
    controllers: [ProductsController],
    providers: [ProductService, CustomThrottleGuard]
})


export class ProductsModule {



}