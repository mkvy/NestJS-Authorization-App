import { UsersService } from '../users.service';
import { User } from '../user.entity';
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";


describe('UsersService', () => {
  let usersService: UsersService;
  let findOne: jest.Mock;

  beforeEach(async () => {
    findOne = jest.fn();
    const module = await Test.createTestingModule(
      {
        providers: [UsersService,
          {
            provide: getRepositoryToken(User),
            useValue: {
              findOne,
            },
          }
        ],
      }).compile();
    usersService = await module.get(UsersService);
  });
  describe('when getting user by email', () => {
    describe('and the user is matched', () => {
      let user = {
        id: '123',
        email: 'test@test.com',
        password: 'testtest123'
      }
      beforeEach(() =>  {
        findOne.mockReturnValue(Promise.resolve(user));
      })
      it('should return the user', async () => {
        const fetchedUser = await usersService.getByEmail('test@test.com');
        expect(fetchedUser).toEqual(user);
      })
    })
    describe('and the user is not matched', () => {
      beforeEach(() => {
        findOne.mockReturnValue(undefined);
      })
      it('should throw an error', async () => {
        await expect(usersService.getByEmail('test@test.com')).rejects.toThrow();
      })
    })
  })
});
