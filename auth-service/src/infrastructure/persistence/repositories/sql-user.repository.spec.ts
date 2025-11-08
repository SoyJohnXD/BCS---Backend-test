import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ObjectLiteral, Repository } from 'typeorm';
import { SqlUserRepository } from './sql-user.repository';
import { UserSchema } from '../entities/user.schema';
import { User } from '@/domain/entities/user.entity';
import { UserMapper } from '../mappers/user.mapper';

type MockRepository<TEntity extends ObjectLiteral = ObjectLiteral> = Partial<
  Record<keyof Repository<TEntity>, jest.Mock>
>;

const createMockRepository = <
  TEntity extends ObjectLiteral,
>(): MockRepository<TEntity> => {
  return {
    findOne: jest.fn(),
    save: jest.fn(),
  } as MockRepository<TEntity>;
};

const mockUserSchema: UserSchema = {
  id: 'a-valid-uuid',
  email: 'test@bank.com',
  passwordHash: 'hashed-password',
  createdAt: new Date(),
};

const mockUser = User.fromPrimitives(mockUserSchema);

describe('SqlUserRepository', () => {
  let repository: SqlUserRepository;
  let typeOrmRepo: MockRepository<UserSchema>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SqlUserRepository,
        {
          provide: getRepositoryToken(UserSchema),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    repository = module.get<SqlUserRepository>(SqlUserRepository);
    typeOrmRepo = module.get<MockRepository<UserSchema>>(
      getRepositoryToken(UserSchema),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findByEmail', () => {
    it('should find a user and map it to domain', async () => {
      typeOrmRepo.findOne?.mockResolvedValue(mockUserSchema);

      const user = await repository.findByEmail('test@bank.com');

      expect(typeOrmRepo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@bank.com' },
      });
      expect(user).toBeInstanceOf(User);
      expect(user?.id).toBe(mockUserSchema.id);
    });

    it('should return null if user not found', async () => {
      typeOrmRepo.findOne?.mockResolvedValue(null);

      const user = await repository.findByEmail('not-found@bank.com');

      expect(user).toBeNull();
    });
  });

  describe('save', () => {
    it('should map a domain user to schema and save it', async () => {
      const toPersistenceSpy = jest.spyOn(UserMapper, 'toPersistence');

      await repository.save(mockUser);

      expect(toPersistenceSpy).toHaveBeenCalledWith(mockUser);
      expect(typeOrmRepo.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      );

      toPersistenceSpy.mockRestore();
    });
  });
});
