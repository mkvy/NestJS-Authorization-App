import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { jwtContants } from '../constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    //todo разобраться с контекстом
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.header('Authorization');
    if (!authorizationHeader) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    const [prefix, accessToken] = authorizationHeader.split(' ');
    if (prefix !== 'Bearer') {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }

    const payload = this.jwtService.verify(accessToken, {
      secret: jwtContants.secret,
    });
    if (!payload) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    try {
      await this.usersService.getByEmail(payload);
      return true;
    } catch {
      //todo проверить момент с 404
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
  }
}
