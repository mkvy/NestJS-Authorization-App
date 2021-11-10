import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import CreateUserDto from './dto/createUser.dto';
import { PostgresErrorCode } from '../users/users.constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: CreateUserDto): Promise<User> {
    const newUser = await this.usersRepository.create({
      ...userData,
    });
    try {
      await this.usersRepository.save(newUser);
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    return newUser;
  }

  async getByEmail(email: string): Promise<User> {
    return await this.usersRepository.findOne({ email });
  }
}
