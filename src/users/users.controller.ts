import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/guard/auth.guard.js";
import { CurrentUser } from "../common/decorator/current-user.js";
import { Roles } from "../common/decorator/roles.js";
import { RolesGuard } from "../auth/guard/roles.guard.js";
import { UserServices } from "./users.service.js";
import { Permission } from "../common/decorator/permission.js";


@Controller("users")
@UseGuards(AuthGuard, RolesGuard)
export class UsersController {

    constructor(private readonly userServices: UserServices) { }

    @Get("/:id/order")
    @Roles("admin")
    async findUserOrderById(@Param("id") id: number) {
        try {
            let response = await this.userServices.getOrderByUserId(id);

            return response;

        } catch (error) {
            throw error;
        }

    }

    @Post("add-profile")
    @Roles("admin")
    @Permission("create")
    async addUserProfile(@CurrentUser() user: any, @Body() body: any) {

        try {

            let add = await this.userServices.addUserProfile(user.sub)
            if (add) {
                return {
                    msg: "User profile addedd successfull"
                }
            }

        } catch (err) {
            throw err;
        }

    }


}