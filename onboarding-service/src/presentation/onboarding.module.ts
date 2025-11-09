import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OnboardingController } from './controllers/onboarding.controller';
import { CreateOnboardingUseCase } from '@/application/use-cases/create-onboarding.use-case';
import { IOnboardingRepository } from '@/domain/repositories/onboarding.repository';
import { OnboardingRequestSchema } from '@/infrastructure/persistence/entities/onboarding-request.schema';
import { SqlOnboardingRepository } from '@/infrastructure/persistence/repositories/sql-onboarding.repository';
import { IValidationApiPort } from '@/application/ports/validation-api.port';
import { HttpValidationApiAdapter } from '@/infrastructure/services/http-validation-api.adapter';
import { InternalController } from './controllers/internal.controller';
import { UpdateOnboardingStatusUseCase } from '@/application/use-cases/update-onboarding-status.use-case';
import { INotificationPort } from '@/application/ports/notification.port';
import { LogNotificationAdapter } from '@/infrastructure/services/log-notification.adapter';

@Module({
  imports: [
    TypeOrmModule.forFeature([OnboardingRequestSchema]),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  controllers: [OnboardingController, InternalController],
  providers: [
    CreateOnboardingUseCase,
    UpdateOnboardingStatusUseCase,

    SqlOnboardingRepository,

    {
      provide: IOnboardingRepository,
      useClass: SqlOnboardingRepository,
    },
    {
      provide: IValidationApiPort,
      useClass: HttpValidationApiAdapter,
    },

    {
      provide: INotificationPort,
      useClass: LogNotificationAdapter,
    },
  ],
})
export class OnboardingModule {}
