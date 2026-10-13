import { CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";



export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();


        const user = request.user;
        if (user.role != "admin") {
            throw new ForbiddenException("Only Admin can access it")
        }
        return true;

    }
}