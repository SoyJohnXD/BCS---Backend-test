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
}
