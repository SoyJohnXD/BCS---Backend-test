import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { OnboardingController } from '@/presentation/controllers/onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { IProductLookupPort } from '@/application/ports/product-lookup.port';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';
import { randomUUID } from 'crypto';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { APP_FILTER } from '@nestjs/core';
import { OnboardingInProgressExceptionFilter } from '@/presentation/filters/onboarding-in-progress-exception.filter';
import { OnboardingNotFoundExceptionsFilter } from '@/presentation/filters/not-found-exceptions.filter';

class InMemoryOnboardingRepository implements IOnboardingRepository {
  private store: OnboardingRequest[] = [];
  async save(request: OnboardingRequest): Promise<void> {
    this.store.push(request);
  }
  async findById(id: string): Promise<OnboardingRequest | null> {
    return this.store.find((r) => r.id === id) ?? null;
  }
  async update(request: OnboardingRequest): Promise<void> {
    this.store = this.store.map((r) => (r.id === request.id ? request : r));
  }
  async findActiveByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<OnboardingRequest | null> {
    return (
      this.store.find(
        (r) =>
          r.createdByUserId === userId &&
          r.productId === productId &&
          r.status === OnboardingStatus.REQUESTED,
      ) ?? null
    );
  }
}

class StubProductPort implements IProductLookupPort {
  existing = new Set<string>();
  async exists(productId: string): Promise<boolean> {
    return Promise.resolve(this.existing.has(productId));
  }
}

describe('Onboarding e2e', () => {
  let app: INestApplication;
  let repo: InMemoryOnboardingRepository;
  let productPort: StubProductPort;
  const VALID_PRODUCT_ID = '550e8400-e29b-41d4-a716-446655440000';
  const MISSING_PRODUCT_ID = '550e8400-e29b-41d4-a716-446655440001';

  beforeAll(async () => {
    repo = new InMemoryOnboardingRepository();
    productPort = new StubProductPort();
    productPort.existing.add(VALID_PRODUCT_ID);

    const moduleRef = await Test.createTestingModule({
      controllers: [OnboardingController],
      providers: [
        CreateOnboardingUseCase,
        { provide: IOnboardingRepository, useValue: repo },
        { provide: IProductLookupPort, useValue: productPort },
        {
          provide: IValidationApiPort,
          useValue: { requestValidation: jest.fn() },
        },
        { provide: APP_FILTER, useClass: OnboardingInProgressExceptionFilter },
        { provide: APP_FILTER, useClass: OnboardingNotFoundExceptionsFilter },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ transform: true, whitelist: true }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  const makeBody = () => ({
    name: 'Name',
    documentNumber: '12345678',
    email: 'test@example.com',
    initialAmount: 1000,
    productId: VALID_PRODUCT_ID,
  });

  it('successful creation returns 201 and id', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const res = await request(server)
      .post('/onboarding')
      .set('x-user-id', randomUUID())
      .send(makeBody())
      .expect(201);
    const body = res.body as { onboardingId: string; status: OnboardingStatus };
    expect(body.onboardingId).toBeDefined();
    expect(body.status).toBe(OnboardingStatus.REQUESTED);
  });

  it('duplicate request returns 409', async () => {
    const userId = randomUUID();
    const server = app.getHttpServer() as unknown as import('http').Server;
    await request(server)
      .post('/onboarding')
      .set('x-user-id', userId)
      .send(makeBody())
      .expect(201);

    const res = await request(server)
      .post('/onboarding')
      .set('x-user-id', userId)
      .send(makeBody())
      .expect(409);
    const body = res.body as { error?: string };
    expect(body.error).toBe('Conflict');
  });

  it('nonexistent product returns 404', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const res = await request(server)
      .post('/onboarding')
      .set('x-user-id', randomUUID())
      .send({
        ...makeBody(),
        productId: MISSING_PRODUCT_ID,
      })
      .expect(404);
    const body = res.body as { error?: string };
    expect(body.error).toBe('Not Found');
  });

  it('missing x-user-id header returns 400', async () => {
    const server = app.getHttpServer() as unknown as import('http').Server;
    const res = await request(server)
      .post('/onboarding')
      .send(makeBody())
      .expect(400);
    const body = res.body as { onboardingId?: string };
    expect(body.onboardingId).toBeUndefined();
  });
});
