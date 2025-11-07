import { Injectable } from '@nestjs/common';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BcryptAdapter implements IPasswordHasher {
  private readonly SALT_ROUNDS = 10;

  async hash(plainText: string): Promise<string> {
    return bcrypt.hash(plainText, this.SALT_ROUNDS);
  }

  async compare(plainText: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plainText, hash);
  }
}
