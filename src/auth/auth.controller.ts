import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import registerDto from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/JwtAuthGuard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
  ) {}

  @HttpCode(200)
  @Post('signup')
  async register(@Body() registrationData: registerDto) {
    return await this.authService.register(registrationData);
  }

  @HttpCode(200)
  @Post('signin')
  async authorize(@Body() authData: registerDto) {
    return await this.authService.authorize(authData);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('tokenAuth')
  async tokenAuth() {
    return 'Ok';
  }
}
