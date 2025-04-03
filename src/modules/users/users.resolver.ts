import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { Role, User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { SignInResponse } from './dto/sign-in-response';
import { SingInDto } from './dto/sing-In.dto';
import { UseGuards } from '@nestjs/common';
import { JwtGuards } from './guards/jwt.guards';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from './guards/role.guards';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => User)
  async signUp(
    @Args('createUserDto') createUserDto: CreateUserDto
  ) {
    const signup = this.usersService.signUp(createUserDto)
    console.log('\x1b[34m%s\x1b[0m', `
     -----------------------------------------------
     |            🔹 🎊Welcome Join🎊              |
     -----------------------------------------------
    `);
    
    return signup
  }

  @Mutation(() => SignInResponse)
  async signIn(
    @Args('signInInput') singInDto: SingInDto,
    @Args('origin') origin: string
  ) {
    const signin = await this.usersService.signIn(singInDto, origin)
    console.log('\x1b[35m%s\x1b[0m', ` 
    -----------------------------------------------
    |        🔹 🎉sigin Success Response🎉        |
    -----------------------------------------------
    `)
    console.log('\x1b[32m%s\x1b[0m', '✅ Access Token:', '\x1b[36m', signin.accessToken);
    console.log('\x1b[32m%s\x1b[0m', '🔄 Refresh Token:', '\x1b[36m', signin.refreshToken);

    return signin
  }

  @Query(() => User)
  @UseGuards(JwtGuards, RolesGuard)
  @Roles(Role.ADMIN)
  async getUser(@Args('email') email: string) {
    console.log('📁GetUser - Attempting to fetch user with email:', email);
    const user = await this.usersService.findUserByEmail(email);
    console.log('📁GetUser - Found user:', user);
    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtGuards, RolesGuard)
  @Roles(Role.ADMIN)
  async updateUserRole(
    @Args('email') email: string,
    @Args('role', { type: () => Role }) role: Role
  ) {
    const update = this.usersService.updateUserRole(email, role)
    console.log('\x1b[34m%s\x1b[0m', `
    -----------------------------------------------
    |     ✨Permissions have been changed.✨      |
    -----------------------------------------------
   `)
   console.log(`${email} Role has been Changed to ${role}`)
    return update
  }
}
