import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { Product } from '@/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';
import { ProductMapper } from '../mappers/product.mapper';

@Injectable()
export class SqlProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(ProductSchema)
    private readonly typeOrmRepo: Repository<ProductSchema>,
  ) {}

  async save(product: Product): Promise<void> {
    const schema = ProductMapper.toPersistence(product);
    await this.typeOrmRepo.save(schema);
  }

  async findById(id: string): Promise<Product | null> {
    const schema = await this.typeOrmRepo.findOne({ where: { id } });
    if (!schema) {
      return null;
    }
    return ProductMapper.toDomain(schema);
  }

  async findAll(): Promise<Product[]> {
    const schemas = await this.typeOrmRepo.find();
    return schemas.map((schema) => ProductMapper.toDomain(schema));
  }
}
