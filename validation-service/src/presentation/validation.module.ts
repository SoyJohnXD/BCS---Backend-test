import { Module } from '@nestjs/common';
import { ValidationController } from './controllers/validation.controller';
import { SimulateValidationUseCase } from '@/application/use-cases/simulate-validation.use-case';
import { IOnboardingApiPort } from '@/application/ports/onboarding-api.port';
import { HttpOnboardingApiAdapter } from '@/infrastructure/services/http-onboarding-api.adapter';

@Module({
  imports: [],
  controllers: [ValidationController],
  providers: [
    SimulateValidationUseCase,

    HttpOnboardingApiAdapter,

    {
      provide: IOnboardingApiPort,
      useClass: HttpOnboardingApiAdapter,
    },
  ],
})
export class ValidationModule {}
