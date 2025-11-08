import { ValueTransformer } from 'typeorm';
import { EncryptionService } from '@/infrastructure/services/encryption.service';

export class PiiTransformer implements ValueTransformer {
  private readonly encryptionService: EncryptionService;

  constructor() {
    this.encryptionService = new EncryptionService();
  }

  to(value: string | null | undefined): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }
    return this.encryptionService.encrypt(value);
  }

  from(value: string | null | undefined): string | null | undefined {
    if (value === null || value === undefined) {
      return value;
    }
    return this.encryptionService.decrypt(value);
  }
}
