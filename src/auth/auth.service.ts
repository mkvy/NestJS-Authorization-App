import { HttpException, HttpStatus, Injectable, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import registerDto from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import PostgresErrorCode from './constants';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registrationData: registerDto) {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);
    try {
      const access_token = this.jwtService.sign({
        email: registrationData.email,
      });
      const createdUser = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
      });
      return access_token;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      //todo валидация почты и пароля
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
