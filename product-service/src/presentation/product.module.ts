import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controllers/product.controller';
import { GetProductsUseCase } from '@/application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@/application/use-cases/get-product-by-id.use-case';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ICacheService } from '@/application/ports/cache.port';
import { ProductSchema } from '@/infrastructure/persistence/entities/product.schema';
import { SqlProductRepository } from '@/infrastructure/persistence/repositories/sql-product.repository';
import { RedisCacheAdapter } from '@/infrastructure/services/redis-cache.adapter';
import { SeederService } from '@/infrastructure/seeding/seeder.service';
import { APP_FILTER } from '@nestjs/core';
import { DomainExceptionFilter } from './filters/domain-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([ProductSchema])],
  controllers: [ProductController],
  providers: [
    GetProductsUseCase,
    GetProductByIdUseCase,

    SqlProductRepository,
    RedisCacheAdapter,

    {
      provide: IProductRepository,
      useClass: SqlProductRepository,
    },
    {
      provide: ICacheService,
      useClass: RedisCacheAdapter,
    },

    SeederService,
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class ProductModule {}
