import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingRequestSchema } from '../entities/onboarding-request.schema';

export class OnboardingMapper {
  static toDomain(schema: OnboardingRequestSchema): OnboardingRequest {
    return OnboardingRequest.fromPrimitives({
      id: schema.id,
      nombre: schema.nombre,
      documento: schema.documento,
      email: schema.email,
      montoInicial: Number(schema.montoInicial),
      status: schema.status,
      createdAt: schema.createdAt,
    });
  }

  static toPersistence(entity: OnboardingRequest): OnboardingRequestSchema {
    const primitives = entity.toPrimitives();

    const schema = new OnboardingRequestSchema();
    schema.id = primitives.id;
    schema.nombre = primitives.nombre;
    schema.documento = primitives.documento;
    schema.email = primitives.email;
    schema.montoInicial = primitives.montoInicial;
    schema.status = primitives.status;
    schema.createdAt = primitives.createdAt;

    return schema;
  }
}
