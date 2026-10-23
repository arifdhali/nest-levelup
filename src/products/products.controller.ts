import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ProductService } from "./products.service.js";
import { AuthGuard } from "../auth/guard/auth.guard.js";
import { CurrentUser } from "../common/decorator/current-user.js";
import { RolesGuard } from "../auth/guard/roles.guard.js";
import { Roles } from "../common/decorator/roles.js";
import { Permission } from "../common/decorator/permission.js";
import { PermissionGuard } from "../auth/guard/permission.guard.js";
import { readDTO } from "./dto/read.product.js";
import { updateDTO } from "./dto/update.product.js";

@Controller("products")
// @Roles("admin", "user")
@UseGuards(AuthGuard, RolesGuard, PermissionGuard)
export class ProductsController {
    constructor(private readonly productsService: ProductService) { }
    @Get()
    @Permission('read')
    async getAllProducts(@CurrentUser() user: unknown, @Body() body: readDTO) {


        return await this.productsService.getProduct(body);
    }


    @Post("create")
    @Roles("superAdmin")
    async createProduct(@Body() body: any) {

        // return await this.productsService.createProduct(body);

    }


    @Delete(":id")
    @Roles("superAdmin")
    @Permission("delete")
    deleteProduct(@Param("id") id: string) {

        return {
            param: id,
            msg: "delete only for "
        }
    }


    @Patch("edit/:productId")
    async update(@Param("productId") id: number, @Body() body: updateDTO) {
        try {
            return await this.productsService.update(id, body)
        } catch (error) {
            throw error
        }

    }



}