import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { SingInDto } from './dto/sing-In.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { AppConfigService } from './../../config/app/config.service';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService : JwtService,
    private appConfigService: AppConfigService
  ) {}
  signUp(createUserDto: CreateUserDto) {
    const user = this.userRepository.create(createUserDto)
    return this.userRepository.save(user)
  }

  async signIn(signInDto: SingInDto, origin: string) {
    const user = await this.userRepository.findOne({where :{ email: signInDto.email}})
    if(!user) {
      throw new UnauthorizedException('')
    }
    return this.jwtTokenBuilder(signInDto.email, origin)
  }

  async findUserById(email: string) {
    const user = await this.userRepository.findOne({
      where : { email }
    })
    return instanceToPlain(user);
  }
  async findUserByEmail(email: string) {
    const user = await this.userRepository.findOne({ where: { email }})
    if(!user) {
      throw new UnauthorizedException('Not Found User')
    }
    return user
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where : { id }
    })
    if(!user) {
      throw new UnauthorizedException('Not Found User')
    }
    return user
  }

  jwtTokenBuilder(email: string, origin: string) {
    const { accessToken, accessOption } = this.setAccessToken(
      email,
      origin,
    );

    const { refreshToken, refreshOption } = this.setRefreshToken(
      email,
      origin,
    );

    return {
      accessToken,
      refreshToken,
      accessOption,
      refreshOption,
    };
  }

  setAccessToken(email: string, requestDomain: string) {
    const payload = { sub: email }
    const maxAge = 24 * 3600
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtSecret,
      expiresIn: maxAge
    })

    return { 
      accessToken: token,
      accessOption: this.setCookieOption(maxAge, requestDomain)
    }
  }

  setRefreshToken(email: string, requestDomain: string) {
    const payload = { sub: email }
    const maxAge = 30 * 24 * 3600
    const token = this.jwtService.sign(payload, {
      secret: this.appConfigService.jwtRefreshSecret,
      expiresIn: maxAge
    })

    return { 
      refreshToken: token,
      refreshOption: this.setCookieOption(maxAge, requestDomain)

    }
  }

  expireJwtToken(requestDomain : string) {
    return {
      accessOption: this.setCookieOption(0, requestDomain),
      refreshOption: this.setCookieOption(0, requestDomain)

    }
  }

  setCookieOption(maxAge: number, requestDomain: string) {
    let domain : string;
    if(
      requestDomain.includes('127.0.0.1') || requestDomain.includes('localhost')
    )
    domain = 'localhost'
    else {
      domain = 'requestDomain'
    }
    return {
      domain,
      path: '/',
      httpOnly: true,
      maxAge,
      samSite: 'lax'
    }
  }

  async updateUserRole(email: string, role: any) {
    console.log('Updating user role:', { email, role });
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.roles = role;
    return this.userRepository.save(user);
  }
}
