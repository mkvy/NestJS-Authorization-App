import { UsersService } from '../users.service';
import { User, UsersRepositoryFake } from '../user.entity';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HttpException } from '@nestjs/common';

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
  describe('when getting user by email', () => {
    it('throws an error when no user exists', async () => {
      const randomEmail = 'test@test.com';

      const usersRepositoryFindOneSpy = jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(null);
      expect.assertions(3);
      try {
        await usersService.getByEmail(randomEmail);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect(e.message).toBe('User with this email does not exist');
      }
      expect(usersRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: randomEmail,
      });
    });
    it('should return user', async () => {
      const randomEmail = 'test@test.com';
      const existingUser = {
        id: 123,
        email: randomEmail,
        password: 'testtest123',
      };
      const usersRepositoryFindOneSpy = jest
        .spyOn(usersRepository, 'findOne')
        .mockResolvedValue(existingUser);
      const result = await usersService.getByEmail(randomEmail);
      expect(result).toBe(existingUser);
      expect(usersRepositoryFindOneSpy).toHaveBeenCalledWith({
        email: randomEmail,
      });
    });
  });
});
