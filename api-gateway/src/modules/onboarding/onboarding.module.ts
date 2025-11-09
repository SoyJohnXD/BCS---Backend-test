import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SecurityModule } from '@/modules/security/security.module';
import { OnboardingController } from './controllers/onboarding.controller';

@Module({
  imports: [SecurityModule, HttpModule],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
