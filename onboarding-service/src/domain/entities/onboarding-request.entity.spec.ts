import { OnboardingRequest } from './onboarding-request.entity';
import { OnboardingStatus } from '../value-objects/onboarding-status.vo';

describe('OnboardingRequest Entity', () => {
  const validProps = {
    nombre: 'Cliente Prueba',
    documento: '123456789',
    email: 'cliente@prueba.com',
    montoInicial: 100,
  };

  it('should create a new request with REQUESTED status', () => {
    const request = OnboardingRequest.create(validProps);

    expect(request).toBeInstanceOf(OnboardingRequest);
    expect(request.id).toBeDefined();
    expect(request.status).toBe(OnboardingStatus.REQUESTED);
    expect(request.toPrimitives().montoInicial).toBe(100);
  });

  it('should throw an error if montoInicial is negative', () => {
    const invalidProps = {
      ...validProps,
      montoInicial: -50,
    };

    expect(() => OnboardingRequest.create(invalidProps)).toThrow(
      'El monto inicial no puede ser negativo',
    );
  });

  it('should reconstitute a user from primitives', () => {
    const primitives = {
      id: 'a-valid-uuid',
      nombre: 'Cliente Existente',
      documento: '987654321',
      email: 'existente@prueba.com',
      montoInicial: 500,
      status: OnboardingStatus.APPROVED,
      createdAt: new Date(),
    };

    const request = OnboardingRequest.fromPrimitives(primitives);

    expect(request).toBeInstanceOf(OnboardingRequest);
    expect(request.id).toBe(primitives.id);
    expect(request.status).toBe(OnboardingStatus.APPROVED);
  });

  it('should convert the entity to primitives', () => {
    const request = OnboardingRequest.create(validProps);
    const primitives = request.toPrimitives();

    expect(primitives).toEqual({
      id: request.id,
      nombre: request.nombre,
      documento: request.documento,
      email: request.email,
      montoInicial: request.montoInicial,
      status: OnboardingStatus.REQUESTED,
      createdAt: request.createdAt,
    });
  });
});
