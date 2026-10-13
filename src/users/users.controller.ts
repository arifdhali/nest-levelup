import { Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guard/auth.guard.js";
import { CurrentUser } from "../common/decorator/current-user.js";
import { Roles } from "../common/decorator/roles.js";
import { RolesGuard } from "../auth/guard/roles.guard.js";
import { UserServices } from "./users.service.js";

@Controller("users")
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {

    constructor(private readonly userServices: UserServices) { }

    @Get("/:id/order")
    @Roles("user")
    async findUserOrderById(@Param("id") id: number) {
        try {
            let response = await this.userServices.getOrderByUserId(id);


            return response;

        } catch (error) {
            throw error;
        }

    }


}