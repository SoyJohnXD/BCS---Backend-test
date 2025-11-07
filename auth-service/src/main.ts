// auth-service/src/main.ts

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 2. Arranca la aplicación usando AppModule
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
