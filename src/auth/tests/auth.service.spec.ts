import { AuthService } from '../auth.service';
import { UsersService } from '../../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { HttpException } from '@nestjs/common';

describe('Auth Service test', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let bcryptCompare: jest.Mock;
  let bcryptHash: jest.Mock;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: UsersService,
          useFactory: () => ({
            create: jest.fn(() => ['']),
            getByEmail: jest.fn(() => []),
          }),
        },
      ],
    }).compile();
    bcryptCompare = jest.fn().mockReturnValue(true);
    bcryptHash = jest.fn().mockReturnValue('hashpassword123');
    (bcrypt.compare as jest.Mock) = bcryptCompare;
    (bcrypt.hash as jest.Mock) = bcryptHash;
    authService = await module.get<AuthService>(AuthService);
    usersService = await module.get<UsersService>(UsersService);
  });
  describe('when registering a user', () => {
    it('should return token string', async () => {
      const dto = new RegisterDto();
      const authServiceRegisterSpy = jest
        .spyOn(authService, 'register')
        .mockResolvedValue('');
      const result = await authService.register(dto);
      expect(authServiceRegisterSpy).toHaveBeenCalledWith(dto);
      expect(result).toBe('');
    });
    it('should throw an error', async () => {
      jest.spyOn(usersService, 'create').mockResolvedValue(undefined);
      try {
        const dto = new RegisterDto();
        await authService.register(dto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('Error creating user');
      }
    });
  });
  describe('when trying to authorize user', () => {
    describe('and password is not valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });
      it('should throw an error', async () => {
        try {
          const dto = new RegisterDto();
          await authService.authorize(dto);
        } catch (e) {
          expect(e).toBeInstanceOf(HttpException);
          expect(e.message).toBe('Wrong credentials');
        }
      });
    });
    describe('and password is valid', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(true);
      });
      describe('and the user is not found', () => {
        beforeEach(() => {
          jest.spyOn(usersService, 'getByEmail').mockResolvedValue(undefined);
        });
        it('should throw an error', async () => {
          try {
            const dto = new RegisterDto();
            await authService.authorize(dto);
          } catch (e) {
            expect(e).toBeInstanceOf(HttpException);
            expect(e.message).toBe('Wrong credentials');
          }
        });
      });
      describe('and the user is found', () => {
        it('should return token string', async () => {
          const dto = new RegisterDto();
          const authServiceRegisterSpy = jest
            .spyOn(authService, 'register')
            .mockResolvedValue('');
          const result = await authService.register(dto);
          expect(authServiceRegisterSpy).toHaveBeenCalledWith(dto);
          expect(result).toBe('');
        });
      });
    });
  });
});
