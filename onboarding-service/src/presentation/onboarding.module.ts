import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './controllers/onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequestSchema } from '@/infrastructure/persistence/entities/onboarding-request.schema';
import { SqlOnboardingRepository } from '@/infrastructure/persistence/repositories/sql-onboarding.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OnboardingRequestSchema])],
  controllers: [OnboardingController],
  providers: [
    CreateOnboardingUseCase,

    SqlOnboardingRepository,

    {
      provide: IOnboardingRepository,
      useClass: SqlOnboardingRepository,
    },
  ],
})
export class OnboardingModule {}
