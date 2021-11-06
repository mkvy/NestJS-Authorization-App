import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtContants } from './constants';

@Module({
  providers: [AuthService],
  imports: [
    UsersModule,
    JwtModule.register({
      secret: jwtContants.secret,
      signOptions: { expiresIn: '2h' },
    }),
  ],
  exports: [AuthService],
})
export class AuthModule {}
