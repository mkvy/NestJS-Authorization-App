import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registrationData: RegisterDto): Promise<string> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    const access_token = this.jwtService.sign({
      email: registrationData.email,
    });
    const createdUser = await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
    });
    if (!createdUser) {
      throw new HttpException('Error creating user', HttpStatus.BAD_REQUEST)
    }
    return access_token;
  }

  async authorize(authData: RegisterDto): Promise<string> {
    const access_token = this.jwtService.sign({
      email: authData.email,
    });
    const user = await this.usersService.getByEmail(authData.email);
    if (!user) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }
    const isPasswordMatching = await bcrypt.compare(
      authData.password,
      user.password,
    );
    if (!isPasswordMatching) {
      throw new HttpException('Wrong credentials', HttpStatus.BAD_REQUEST);
    }
    return access_token;
  }
}
