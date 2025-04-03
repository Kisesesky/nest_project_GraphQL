import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { UsersService } from './../users.service';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { AppConfigService } from "../../../config/app/config.service";
import { Role } from "../entities/user.entity";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        private appConfigService: AppConfigService,
        private usersService: UsersService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: appConfigService.jwtSecret!
        })
    }

    async validate(payload: any) {
        try {
            const { sub } = payload;
            const user = await this.usersService.findUserByEmail(sub);
            
            if (!user) {
                throw new UnauthorizedException('User not found');
            }

            const userWithRole = {
                ...user,
                roles: user.roles as Role
            };
            
            return userWithRole;
        } catch (error) {
            throw error;
        }
    }
}