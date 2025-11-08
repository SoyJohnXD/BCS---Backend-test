import { User } from './user.entity';

describe('User Entity', () => {
  const validProps = {
    email: 'test@bank.com',
    passwordHash: 'hashed-password',
  };

  it('should create a new user with valid properties', () => {
    const user = User.create(validProps);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBeDefined();
    expect(user.email).toBe('test@bank.com');
    expect(user.passwordHash).toBe('hashed-password');
    expect(user.createdAt).toBeInstanceOf(Date);
  });

  it('should throw an error if email is invalid', () => {
    const invalidProps = {
      email: 'invalid-email',
      passwordHash: 'hashed-password',
    };

    expect(() => User.create(invalidProps)).toThrow(
      'El email del usuario no es válido',
    );
  });

  it('should throw an error if email is not provided', () => {
    const invalidProps = {
      email: null,
      passwordHash: 'hashed-password',
    } as unknown as Parameters<typeof User.create>[0];

    expect(() => User.create(invalidProps)).toThrow(
      'El email del usuario no es válido',
    );
  });

  it('should reconstitute a user from primitives', () => {
    const primitives = {
      id: 'a-valid-uuid',
      email: 'test@bank.com',
      passwordHash: 'hashed-password',
      createdAt: new Date(),
    };

    const user = User.fromPrimitives(primitives);

    expect(user).toBeInstanceOf(User);
    expect(user.id).toBe(primitives.id);
    expect(user.email).toBe(primitives.email);
  });

  it('should convert the entity to primitives', () => {
    const user = User.create(validProps);
    const primitives = user.toPrimitives();

    expect(primitives).toEqual({
      id: user.id,
      email: user.email,
      passwordHash: user.passwordHash,
      createdAt: user.createdAt,
    });
  });
});
