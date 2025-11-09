import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequest } from '@/domain/entities/onboarding-request.entity';
import {
  OnboardingRequestOrmEntity,
  OnboardingRequestSchema,
} from '../entities/onboarding-request.schema';
import { OnboardingMapper } from '../mappers/onboarding.mapper';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

@Injectable()
export class SqlOnboardingRepository implements IOnboardingRepository {
  constructor(
    @InjectRepository(OnboardingRequestSchema)
    private readonly typeOrmRepo: Repository<OnboardingRequestOrmEntity>,
  ) {}

  async save(request: OnboardingRequest): Promise<void> {
    const schema = OnboardingMapper.toPersistence(request);

    await this.typeOrmRepo.save(schema);
  }

  async findById(id: string): Promise<OnboardingRequest | null> {
    const schema = await this.typeOrmRepo.findOne({ where: { id } });

    if (!schema) {
      return null;
    }

    return OnboardingMapper.toDomain(schema);
  }

  async update(request: OnboardingRequest): Promise<void> {
    const schema = OnboardingMapper.toPersistence(request);
    await this.typeOrmRepo.save(schema);
  }

  async findActiveByUserAndProduct(
    userId: string,
    productId: string,
  ): Promise<OnboardingRequest | null> {
    const found = await this.typeOrmRepo.findOne({
      where: {
        createdByUserId: userId,
        productId: productId,
        status: OnboardingStatus.REQUESTED,
      } as any,
    });

    return found ? OnboardingMapper.toDomain(found) : null;
  }
}
