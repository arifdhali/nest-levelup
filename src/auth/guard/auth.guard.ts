import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {

        const ctx = context.switchToHttp();
        const request = ctx.getRequest();


        const authHeader = request.headers["authorization"]

        if (!authHeader?.startsWith("Bearer ")) {
            throw new UnauthorizedException("Authentication")
        }
        const token = authHeader.split(" ")[1];

        try {
            const payload = await this.jwtService.verifyAsync(token)
            request.user = payload;
            return true;
        } catch (error: any) {
            throw new UnauthorizedException(error.message)
        }

    }
}