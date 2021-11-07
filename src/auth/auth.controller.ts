import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import registerDto from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSerice: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('signup')
  async register(@Body() registrationData: registerDto) {
    return await this.authSerice.register(registrationData);
  }
  @Post('signin')
  async authorize(@Body() authData: registerDto) {
    return await this.authSerice.authorize(authData);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('tokenAuth')
  async tokenAuth(@Body() body) {}
}
