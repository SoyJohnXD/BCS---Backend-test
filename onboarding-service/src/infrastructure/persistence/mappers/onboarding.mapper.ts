import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingRequestSchema } from '../entities/onboarding-request.schema';

export class OnboardingMapper {
  static toDomain(schema: OnboardingRequestSchema): OnboardingRequest {
    return OnboardingRequest.fromPrimitives({
      id: schema.id,
      name: schema.name,
      documentNumber: schema.documentNumber,
      email: schema.email,
      initialAmount: Number(schema.initialAmount),
      status: schema.status,
      createdAt: schema.createdAt,
      updatedAt: schema.createdAt, // schema lacks updatedAt column; reuse createdAt
    });
  }

  static toPersistence(entity: OnboardingRequest): OnboardingRequestSchema {
    const primitives = entity.toPrimitives();

    const schema = new OnboardingRequestSchema();
    schema.id = primitives.id;
    schema.name = primitives.name;
    schema.documentNumber = primitives.documentNumber;
    schema.email = primitives.email;
    schema.initialAmount = primitives.initialAmount;
    schema.status = primitives.status;
    schema.createdAt = primitives.createdAt;

    return schema;
  }
}
