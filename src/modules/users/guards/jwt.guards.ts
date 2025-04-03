import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from "@nestjs/graphql";

@Injectable()
export class JwtGuards extends AuthGuard('jwt') {
    getRequest(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        return ctx.getContext().req;
    }

    handleRequest(err: any, user: any, info: any) {
        if (err || !user) {
            throw err || new Error('Authentication failed');
        }
        return user;
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const result = (await super.canActivate(context)) as boolean;
            if (result) {
                const ctx = GqlExecutionContext.create(context);
                const req = ctx.getContext().req;
            }
            return result;
        } catch (error) {
            throw error;
        }
    }
}