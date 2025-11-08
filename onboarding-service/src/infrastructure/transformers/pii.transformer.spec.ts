import { PiiTransformer } from './pii.transformer';
import { EncryptionService } from '@/infrastructure/services/encryption.service';

jest.mock('@/infrastructure/services/encryption.service');

describe('PiiTransformer', () => {
  let transformer: PiiTransformer;

  const mockEncrypt = jest.fn((text: string) => `encrypted(${text})`);
  const mockDecrypt = jest.fn((text: string) =>
    text.replace('encrypted(', '').slice(0, -1),
  );

  const MockedEncryptionService = EncryptionService as jest.MockedClass<
    typeof EncryptionService
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockEncrypt.mockClear();
    mockDecrypt.mockClear();
    MockedEncryptionService.mockImplementation(
      () =>
        ({
          encrypt: mockEncrypt,
          decrypt: mockDecrypt,
        }) as unknown as EncryptionService,
    );
    transformer = new PiiTransformer();
  });

  afterEach(() => {
    MockedEncryptionService.mockReset();
  });

  it('should be defined', () => {
    expect(transformer).toBeDefined();
  });

  it('should call encrypt service on "to"', () => {
    const plainText = 'John Doe';
    const result = transformer.to(plainText);

    expect(mockEncrypt).toHaveBeenCalledTimes(1);
    expect(mockEncrypt).toHaveBeenCalledWith(plainText);
    expect(result).toBe('encrypted(John Doe)');
  });

  it('should call decrypt service on "from"', () => {
    const encryptedText = 'encrypted(123456789)';
    const result = transformer.from(encryptedText);

    expect(mockDecrypt).toHaveBeenCalledTimes(1);
    expect(mockDecrypt).toHaveBeenCalledWith(encryptedText);
    expect(result).toBe('123456789');
  });

  it('should handle null or undefined values', () => {
    expect(transformer.to(null)).toBeNull();
    expect(transformer.from(null)).toBeNull();
    expect(transformer.to(undefined)).toBeUndefined();
    expect(transformer.from(undefined)).toBeUndefined();
    expect(mockEncrypt).not.toHaveBeenCalled();
    expect(mockDecrypt).not.toHaveBeenCalled();
  });
});
