import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/JwtAuthGuard';
import { ResponseStatuses } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @HttpCode(200)
  @Post('signup')
  async register(@Body() registrationData: RegisterDto): Promise<string> {
    return await this.authService.register(registrationData);
  }

  @HttpCode(200)
  @Post('signin')
  async authorize(@Body() authData: RegisterDto): Promise<string> {
    return await this.authService.authorize(authData);
  }

  @HttpCode(200)
  @UseGuards(JwtAuthGuard)
  @Post('tokenAuth')
  async tokenAuth() {
    return ResponseStatuses.OK;
  }
}
