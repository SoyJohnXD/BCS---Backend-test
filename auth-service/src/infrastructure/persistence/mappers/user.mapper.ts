import { User } from '@/domain/entities/user.entity';
import { UserSchema } from '@/infrastructure/persistence/entities/user.schema';

export class UserMapper {
  static toDomain(schema: UserSchema): User {
    return User.fromPrimitives({
      id: schema.id,
      email: schema.email,
      passwordHash: schema.passwordHash,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(entity: User): UserSchema {
    const primitives = entity.toPrimitives();

    const schema = new UserSchema();
    schema.id = primitives.id;
    schema.email = primitives.email;
    schema.passwordHash = primitives.passwordHash;
    schema.createdAt = primitives.createdAt;

    return schema;
  }
}
