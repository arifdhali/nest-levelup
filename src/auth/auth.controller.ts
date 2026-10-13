import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthServices } from "./auth.service.js";
import { LoginDto, RegisterDto } from "./dto/login.js";

@Controller("auth")
export class AuthController {


    constructor(private readonly authService: AuthServices) { }

    @Post("register")
    async regiser(@Body() body: RegisterDto) {


        try {
            let registered = await this.authService.register(body);
            if (registered) {
                return {
                    msg: "User registration successfull"
                }
            }
        } catch (err) {
            throw err
        }


    }


    @Post("login")
    async login(@Body() body: LoginDto) {

        const { email, password } = body;

        const isLoggedin = await this.authService.login(email, password)
        if (isLoggedin.status) {
            return {
                msg: "user logged in",
                ref_token: isLoggedin.refreshToken
            }
        }
    }

    @Post("refresh-token")
    async refreshToken(@Body() body: any) {
        const data = await this.authService.refreshToken(body.token)
        return data;
    }


}