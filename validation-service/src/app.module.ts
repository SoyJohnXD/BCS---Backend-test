import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ValidationModule } from '@/presentation/validation.module';
import { HealthController } from '@/presentation/controllers/health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),

    ValidationModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
