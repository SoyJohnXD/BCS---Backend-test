import { EntitySchema } from 'typeorm';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';
import { PiiTransformer } from '@/infrastructure/transformers/pii.transformer';

export interface OnboardingRequestOrmEntity {
  id: string;
  name: string;
  documentNumber: string;
  email: string;
  initialAmount: string;
  status: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  createdByUserId: string;
}

export const OnboardingRequestSchema =
  new EntitySchema<OnboardingRequestOrmEntity>({
    name: 'OnboardingRequest',
    tableName: 'onboarding_requests',
    columns: {
      id: {
        type: 'uuid',
        primary: true,
      },
      name: {
        type: 'varchar',
        nullable: false,
        transformer: new PiiTransformer(),
      },
      documentNumber: {
        type: 'varchar',
        name: 'document_number',
        nullable: false,
        transformer: new PiiTransformer(),
      },
      email: {
        type: 'varchar',
        nullable: false,
        transformer: new PiiTransformer(),
      },
      initialAmount: {
        type: 'decimal',
        name: 'initial_amount',
        precision: 10,
        scale: 2,
        nullable: false,
      },
      status: {
        type: 'enum',
        enum: OnboardingStatus,
        nullable: false,
      },
      productId: {
        type: 'uuid',
        name: 'product_id',
        nullable: false,
      },
      createdByUserId: {
        type: 'uuid',
        name: 'created_by_user_id',
        nullable: false,
      },
      createdAt: {
        type: 'timestamp',
        name: 'created_at',
        createDate: true,
      },
      updatedAt: {
        type: 'timestamp',
        name: 'updated_at',
        updateDate: true,
      },
    },
  });
