import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../../common/decorator/roles.js";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const allowedRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [context.getHandler(), context.getClass()]);

        if (!allowedRoles || allowedRoles.length == 0) {
            return true;
        }

        const ctx = context.switchToHttp();
        const request = ctx.getRequest();

        const user = request.user;

        if (!user || !allowedRoles.includes(user.role)) {
            throw new ForbiddenException("You are not allowed to perform this action")
        }

        return true;

    }
}