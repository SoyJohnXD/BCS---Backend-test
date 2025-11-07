import { Test, TestingModule } from '@nestjs/testing';
import { BcryptAdapter } from './bcrypt.adapter';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('BcryptAdapter', () => {
  let adapter: BcryptAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptAdapter],
    }).compile();

    adapter = module.get<BcryptAdapter>(BcryptAdapter);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(adapter).toBeDefined();
  });

  describe('hash', () => {
    it('should call bcrypt.hash with correct parameters', async () => {
      const plainText = 'password123';
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');

      const result = await adapter.hash(plainText);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainText, 10);
      expect(result).toBe('hashed-password');
    });
  });

  describe('compare', () => {
    it('should call bcrypt.compare with correct parameters', async () => {
      const plainText = 'password123';
      const hash = 'hashed-password';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await adapter.compare(plainText, hash);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hash);
      expect(result).toBe(true);
    });
  });
});
