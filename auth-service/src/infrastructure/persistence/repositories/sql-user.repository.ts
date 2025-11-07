import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { User } from '@/domain/entities/user.entity';
import { UserSchema } from '@/infrastructure/persistence/entities/user.schema';
import { UserMapper } from '@/infrastructure/persistence/mappers/user.mapper';

@Injectable()
export class SqlUserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserSchema)
    private readonly typeOrmRepo: Repository<UserSchema>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const userSchema = await this.typeOrmRepo.findOne({ where: { email } });

    if (!userSchema) {
      return null;
    }

    return UserMapper.toDomain(userSchema);
  }

  async save(user: User): Promise<void> {
    const userSchema = UserMapper.toPersistence(user);
    await this.typeOrmRepo.save(userSchema);
  }
}
