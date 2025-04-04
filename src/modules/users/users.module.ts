import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigModule } from '../../config/app/config.module';
import { PassportModule } from '@nestjs/passport';
import { AppConfigService } from '../../config/app/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: (configService: AppConfigService) => ({
        secret: configService.jwtSecret,
        signOptions: { expiresIn: '1d' },
      }),
    }),
    AppConfigModule,
  ],
  providers: [UsersResolver, UsersService, JwtStrategy],
  exports: [UsersService]
})
export class UsersModule {}
