import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from '@/presentation/controllers/auth.controller';
import { LoginUseCase } from '@/application/use-cases/login.use-case';
import { IUserRepository } from '@/domain/repositories/user.repository';
import { IPasswordHasher } from '@/application/ports/password-hasher.port';
import { ITokenService } from '@/application/ports/token.port';
import { UserSchema } from '@/infrastructure/persistence/entities/user.schema';
import { SqlUserRepository } from '@/infrastructure/persistence/repositories/sql-user.repository';
import { BcryptAdapter } from '@/infrastructure/services/bcrypt.adapter';
import { JwtAdapter } from '@/infrastructure/services/jwt.adapter';
import { SeederService } from '@/infrastructure/seeding/seeder.service';
import { InvalidCredentialsExceptionFilter } from '@/presentation/filters/invalid-credentials-exception.filter';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserSchema]),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'aVeryWeakSecret'),
        signOptions: {
          expiresIn: '5m',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    BcryptAdapter,
    JwtAdapter,
    SqlUserRepository,
    {
      provide: APP_FILTER,
      useClass: InvalidCredentialsExceptionFilter,
    },
    {
      provide: IUserRepository,
      useClass: SqlUserRepository,
    },
    {
      provide: IPasswordHasher,
      useClass: BcryptAdapter,
    },
    {
      provide: ITokenService,
      useClass: JwtAdapter,
    },
    SeederService,
  ],
})
export class AuthModule {}
