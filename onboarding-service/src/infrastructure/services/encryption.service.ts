import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

export class EncryptionService {
  private readonly ALGORITHM = 'aes-256-gcm';
  private readonly IV_LENGTH = 16;
  private readonly AUTH_TAG_LENGTH = 16;
  private readonly KEY: Buffer;

  constructor() {
    const keyString = process.env.ENCRYPTION_KEY;
    if (!keyString || keyString.length !== 32) {
      throw new Error(
        'ENCRYPTION_KEY debe estar definida y tener 32 caracteres.',
      );
    }
    this.KEY = Buffer.from(keyString, 'utf-8');
  }

  /**
   * Cifra un texto plano usando AES-256-GCM.
   *
   * @param plainText El texto a cifrar.
   * @returns Un string en formato base64 que concatena IV, AuthTag y texto cifrado.
   */
  encrypt(plainText: string): string {
    const iv = randomBytes(this.IV_LENGTH);
    const cipher = createCipheriv(this.ALGORITHM, this.KEY, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, 'utf-8'),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    return Buffer.concat([iv, authTag, encrypted]).toString('base64');
  }

  /**
   * Descifra un texto cifrado con AES-256-GCM.
   *
   * @param encryptedText El string base64 que contiene (IV + AuthTag + texto cifrado).
   * @returns El texto plano original.
   */
  decrypt(encryptedText: string): string {
    const encryptedBuffer = Buffer.from(encryptedText, 'base64');

    const iv = encryptedBuffer.subarray(0, this.IV_LENGTH);
    const authTag = encryptedBuffer.subarray(
      this.IV_LENGTH,
      this.IV_LENGTH + this.AUTH_TAG_LENGTH,
    );
    const encrypted = encryptedBuffer.subarray(
      this.IV_LENGTH + this.AUTH_TAG_LENGTH,
    );

    const decipher = createDecipheriv(this.ALGORITHM, this.KEY, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString('utf-8');
  }
}
