import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { Test } from '@nestjs/testing';
import { RegisterDto } from '../dto/register.dto';
import { ResponseStatuses } from '../auth.constants';
import { JwtAuthGuard } from '../guards/JwtAuthGuard';

describe('Auth Controller tests', () => {
  let authController: AuthController;
  let authService: AuthService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: () => ({
            register: jest.fn(() => []),
            authorize: jest.fn(() => []),
          }),
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue([])
      .compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('calling register method', async () => {
    const dto = new RegisterDto();
    const authServiceRegisterSpy = jest.spyOn(authService, 'register');
    expect(authController.register(dto)).not.toEqual(null);
    expect(authServiceRegisterSpy).toHaveBeenCalledWith(dto);
  });

  it('calling auth method', async () => {
    const dto = new RegisterDto();
    const authServiceAuthorizeSpy = jest.spyOn(authService, 'authorize');
    expect(authController.authorize(dto)).not.toEqual(null);
    expect(authServiceAuthorizeSpy).toHaveBeenCalledWith(dto);
  });

  it('calling token', async () => {
    const authControllerTokenSpy = jest
      .spyOn(authController, 'tokenAuth')
      .mockResolvedValue(ResponseStatuses.OK);
    const result = await authController.tokenAuth();
    expect(authControllerTokenSpy).toHaveBeenCalled();
    expect(result).toBe(ResponseStatuses.OK);
  });
});
