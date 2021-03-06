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
import { jwtContants } from '../auth.constants';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    @Inject(UsersService) private usersService: UsersService,
    @Inject(JwtService) private jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorizationHeader = request.header('Authorization');
    if (!authorizationHeader) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    const [prefix, accessToken] = authorizationHeader.split(' ');
    if (prefix !== 'Bearer') {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    let payload = undefined;
    try {
      payload = this.jwtService.verify(accessToken, {
        secret: jwtContants.secret,
      });
    } catch (e) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    if (!payload) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    const userByEmail = await this.usersService.getByEmail(payload.email);
    if (!userByEmail) {
      throw new HttpException('Access denied', HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
