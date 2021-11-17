import { UsersService } from '../users.service';
import { User, UsersRepositoryFake } from '../user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import faker from 'faker';
import exp from 'constants';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: UsersRepositoryFake,
        },
      ],
    }).compile();
    usersService = await module.get(UsersService);
    usersRepository = await module.get(getRepositoryToken(User));
  });
  describe('when creating a user', () => {
    it('it should save and return user', async () => {
      const createUserData = {
        email: 'test@test.com',
        password: 'password123',
      };
      const savedUserData = {
        id: 123,
        ...createUserData,
      };
      const usersRepositoryCreateSpy = jest
        .spyOn(usersRepository, 'create')
        .mockReturnValue(savedUserData);
      const usersRepositorySaveSpy = jest
        .spyOn(usersRepository, 'save')
        .mockResolvedValue(savedUserData);
      const result = await usersService.create(createUserData);
      expect(usersRepositoryCreateSpy).toBeCalledWith(createUserData);
      expect(usersRepositorySaveSpy).toBeCalledWith(savedUserData);
      expect(result).toEqual(savedUserData);
    });
  });
});
