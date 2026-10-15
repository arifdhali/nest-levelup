import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { PERMISSION_KEY } from "../../common/decorator/permission.js";



@Injectable()
export class PermissionGuard implements CanActivate {

    constructor(private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {

        const requiredPermission = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

        if (!requiredPermission.length) {
            return true;
        }

        const ctx = context.switchToHttp();

        const request = ctx.getRequest();
        const user = request.user;
        console.log(user)
        const userPermissions: string[] = user?.permissions ?? [];

        const hasPermission = requiredPermission.every((permisson) => userPermissions.includes(permisson));

        if (!hasPermission) {
            throw new ForbiddenException("Insufficient permissions")
        }





        return true;
    }
}