import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { AuthModule } from '@/auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [AuthModule, HttpModule],
  controllers: [OnboardingController],
})
export class OnboardingModule {}
