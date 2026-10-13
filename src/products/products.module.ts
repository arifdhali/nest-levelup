import { Module } from "@nestjs/common";
import { ProductsController } from "./products.controller.js";
import { ProductService } from "./products.service.js";
import { AuthModule } from "../auth/auth.module.js";

@Module({
    imports: [AuthModule],
    controllers: [ProductsController],
    providers: [ProductService]
})

export class ProductsModule { }