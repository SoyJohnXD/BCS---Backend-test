import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingRequestOrmEntity } from '../entities/onboarding-request.schema';

export class OnboardingMapper {
  static toDomain(schema: OnboardingRequestOrmEntity): OnboardingRequest {
    return OnboardingRequest.fromPrimitives({
      id: schema.id,
      name: schema.name,
      documentNumber: schema.documentNumber,
      email: schema.email,
      initialAmount: Number(schema.initialAmount),
      status: schema.status,
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    });
  }

  static toPersistence(entity: OnboardingRequest): OnboardingRequestOrmEntity {
    const primitives = entity.toPrimitives();

    return {
      id: primitives.id,
      name: primitives.name,
      documentNumber: primitives.documentNumber,
      email: primitives.email,
      initialAmount: primitives.initialAmount.toString(),
      status: primitives.status,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    };
  }
}
