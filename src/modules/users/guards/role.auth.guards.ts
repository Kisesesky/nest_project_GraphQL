import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { GqlExecutionContext } from '@nestjs/graphql';

export class SelfGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const ctx = GqlExecutionContext.create(context)
        const { req } = ctx.getContext()
        const user = req.user
        const args = ctx.getArgs()
        
        const id = Number(args.id)

        if(user.id !== id) {
            throw new UnauthorizedException('error')
        }

        return true
    }
}