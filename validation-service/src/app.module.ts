// validation-service/src/app.module.ts

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ValidationModule } from '@/presentation/validation.module';

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
  controllers: [],
  providers: [],
})
export class AppModule {}
