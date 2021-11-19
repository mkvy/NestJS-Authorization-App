import { AuthController } from "../auth.controller";
import { AuthService } from "../auth.service";
import { Test } from "@nestjs/testing";
import { RegisterDto } from "../dto/register.dto";
import { jwtContants, ResponseStatuses } from "../auth.constants";
import { JwtAuthGuard } from "../guards/JwtAuthGuard";

describe('Auth Controller tests', () => {
  let authController: AuthController;
  let authService: AuthService;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService,
        {
          provide: AuthService,
          useFactory: () => ({
            register: jest.fn(() => []),
            authorize: jest.fn(() => []),
          })
        }
      ]
    }).overrideGuard(JwtAuthGuard).useValue([]).compile();
    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  })
  it('calling register method', async () => {
    const dto = new RegisterDto();
    const authServiceSpy = jest
      .spyOn(authService, 'register');
    expect(authController.register(dto)).not.toEqual(null);
    expect(authServiceSpy).toHaveBeenCalledWith({});
  });
  it('calling auth method', async () => {
    const dto = new RegisterDto();
    const authServiceSpy = jest
      .spyOn(authService, 'register');
    expect(authController.authorize(dto)).not.toEqual(null);
    expect(authServiceSpy).toHaveBeenCalledWith({});
  });
  it('calling token', async () => {
    const authControllerSpy = jest.spyOn(authController,'tokenAuth').mockResolvedValue(ResponseStatuses.OK);
    const result = await authController.tokenAuth();
    expect(authControllerSpy).toHaveBeenCalled();
    expect(result).toBe(ResponseStatuses.OK);
  })
});