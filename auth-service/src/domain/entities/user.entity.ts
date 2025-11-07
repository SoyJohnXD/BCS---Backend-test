import { randomUUID } from 'crypto';

export class User {
  private readonly _id: string;
  private readonly _email: string;
  private readonly _passwordHash: string;
  private readonly _createdAt: Date;

  private constructor(props: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt?: Date;
  }) {
    this._id = props.id;
    this._email = props.email;
    this._passwordHash = props.passwordHash;
    this._createdAt = props.createdAt || new Date();
  }

  public static create(props: { email: string; passwordHash: string }): User {
    if (!props.email || !props.email.includes('@')) {
      throw new Error('El email del usuario no es válido');
    }

    return new User({
      id: randomUUID(),
      email: props.email,
      passwordHash: props.passwordHash,
    });
  }

  public static fromPrimitives(props: {
    id: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
  }): User {
    return new User({
      id: props.id,
      email: props.email,
      passwordHash: props.passwordHash,
      createdAt: props.createdAt,
    });
  }

  get id(): string {
    return this._id;
  }

  get email(): string {
    return this._email;
  }

  get passwordHash(): string {
    return this._passwordHash;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public toPrimitives() {
    return {
      id: this._id,
      email: this._email,
      passwordHash: this._passwordHash,
      createdAt: this._createdAt,
    };
  }
}
