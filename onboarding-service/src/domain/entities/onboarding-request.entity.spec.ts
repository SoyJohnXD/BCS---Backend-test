import { OnboardingRequest } from './onboarding-request.entity';
import { OnboardingStatus } from '../value-objects/onboarding-status.vo';

describe('OnboardingRequest Entity', () => {
  const validProps = {
    name: 'Test Client',
    documentNumber: '123456789',
    email: 'client@test.com',
    initialAmount: 100,
  };

  it('should create a new request with REQUESTED status', () => {
    const request = OnboardingRequest.create(validProps);

    expect(request).toBeInstanceOf(OnboardingRequest);
    expect(request.id).toBeDefined();
    expect(request.status).toBe(OnboardingStatus.REQUESTED);
    expect(request.toPrimitives().initialAmount).toBe(100);
  });

  it('should throw an error if initialAmount is negative', () => {
    const invalidProps = {
      ...validProps,
      initialAmount: -50,
    };

    expect(() => OnboardingRequest.create(invalidProps)).toThrow(
      'Initial amount cannot be negative',
    );
  });

  it('should reconstitute a user from primitives', () => {
    const primitives = {
      id: 'a-valid-uuid',
      name: 'Existing Client',
      documentNumber: '987654321',
      email: 'existing@test.com',
      initialAmount: 500,
      status: OnboardingStatus.APPROVED,
      createdAt: new Date(),
      updatedAt: new Date(),
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
      name: request.name,
      documentNumber: request.documentNumber,
      email: request.email,
      initialAmount: request.initialAmount,
      status: OnboardingStatus.REQUESTED,
      createdAt: request.createdAt,
      updatedAt: primitives.updatedAt, // updatedAt included
    });
  });
});
