import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from "../entities/user.entity";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requireRoles = this.reflector.get<Role[]>('roles', context.getHandler())

        if(!requireRoles) return true

        const ctx = GqlExecutionContext.create(context)
        const request = ctx.getContext().req;

        if(!request?.user) {
            return false;
        }

        const hasRole = requireRoles.includes(request.user.roles as Role);
        if(!hasRole) {
            console.log('\x1b[31m%s\x1b[0m', `
            -------------------------------------------------
            |  🚨 Administrator privileges are required!🔒  |
            -------------------------------------------------
            `)
            throw new ForbiddenException('\x1b[31m%s\x1b[0m', `
            -------------------------------------------------
            |  🚨 Administrator privileges are required!🔒  |
            -------------------------------------------------
            `)
        }

        return hasRole;
    }
}