import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  await app.listen(3000);
}
bootstrap().catch((error) => {
  // Registro explícito del fallo de arranque para facilitar debugging
  console.error('Bootstrap failed', error);
  process.exit(1);
});
