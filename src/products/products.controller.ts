import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./products.service.js";
import { AuthGuard } from "../auth/guard/auth.guard.js";
import { CurrentUser } from "../common/decorator/current-user.js";
import { RolesGuard } from "../auth/guard/roles.guard.js";
import { Roles } from "../common/decorator/roles.js";
import { Permission } from "../common/decorator/permission.js";
import { PermissionGuard } from "../auth/guard/permission.guard.js";

@Controller("products")
// @Roles("admin", "user")
// @UseGuards(AuthGuard, RolesGuard, PermissionGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductService) { }
    @Get()
    getAllProducts(@CurrentUser() user: unknown) {
        console.log(user)
        return this.productsService.getProduct();
    }


    @Post("create")
    @Roles("superAdmin")
    createProduct(@Body() body: any) {

        return {
            msg: "its working "
        }

    }


    @Delete(":id")
    @Roles("superAdmin")
    @Permission("product:delete")
    deleteProduct(@Param("id") id: string) {

        return {
            param: id,
            msg: "delete only for "
        }
    }
}