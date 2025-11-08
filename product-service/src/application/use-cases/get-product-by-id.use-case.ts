import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ICacheService } from '../ports/cache.port';
import { ProductDto } from '../dto/product.dto';
import { Product } from '@/domain/entities/product.entity';

@Injectable()
export class GetProductByIdUseCase {
  private readonly CACHE_TTL_SECONDS = 3600;

  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(ICacheService)
    private readonly cacheService: ICacheService,
  ) {}

  private getCacheKey(id: string): string {
    return `product_detail:${id}`;
  }

  async execute(id: string): Promise<ProductDto | null> {
    const cacheKey = this.getCacheKey(id);

    try {
      const cachedData = await this.cacheService.get(cacheKey);
      if (cachedData) {
        return JSON.parse(cachedData) as ProductDto;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }

    const product = await this.productRepository.findById(id);

    if (!product) {
      return null;
    }

    const productDto = this.mapToDetailDto(product);

    try {
      await this.cacheService.set(
        cacheKey,
        JSON.stringify(productDto),
        this.CACHE_TTL_SECONDS,
      );
    } catch (error) {
      console.error('Error writing cache:', error);
    }

    return productDto;
  }

  private mapToDetailDto(product: Product): ProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      tasaInteres: product.tasaInteres,
      terminosCondiciones: product.terminosCondiciones,
      requisitosElegibilidad: product.requisitosElegibilidad,
    };
  }
}
