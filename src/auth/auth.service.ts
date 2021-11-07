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
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async authorize(authData: registerDto) {
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
