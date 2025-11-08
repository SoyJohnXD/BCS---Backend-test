import { EncryptionService } from './encryption.service';

describe('EncryptionService', () => {
  let service: EncryptionService;
  const originalKey = process.env.ENCRYPTION_KEY;

  beforeEach(() => {
    process.env.ENCRYPTION_KEY = 'super-secret-key-must-be-32-char';
    service = new EncryptionService();
  });

  afterEach(() => {
    process.env.ENCRYPTION_KEY = originalKey;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should encrypt and correctly decrypt a string', () => {
    const plainText = 'John Doe';
    const encrypted = service.encrypt(plainText);
    const decrypted = service.decrypt(encrypted);

    expect(encrypted).not.toEqual(plainText);
    expect(decrypted).toEqual(plainText);
  });

  it('should handle different texts', () => {
    const text1 = 'john.doe@bank.com';
    const text2 = '123456789';

    const encrypted1 = service.encrypt(text1);
    const encrypted2 = service.encrypt(text2);

    expect(service.decrypt(encrypted1)).toEqual(text1);
    expect(service.decrypt(encrypted2)).toEqual(text2);
  });

  it('should throw error if key is invalid', () => {
    process.env.ENCRYPTION_KEY = 'too-short';
    expect(() => new EncryptionService()).toThrow(
      'ENCRYPTION_KEY debe estar definida y tener 32 caracteres.',
    );
  });
});
