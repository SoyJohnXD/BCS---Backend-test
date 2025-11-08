import { Inject, Injectable } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { ICacheService } from '../ports/cache.port';
import { ProductListDto } from '../dto/product-list.dto';
import { Product } from '@/domain/entities/product.entity';
import { ProductSummaryDto } from '../dto/product-summary.dto';

@Injectable()
export class GetProductsUseCase {
  private readonly CACHE_KEY = 'all_products_summary';
  private readonly CACHE_TTL_SECONDS = 3600;

  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
    @Inject(ICacheService)
    private readonly cacheService: ICacheService,
  ) {}

  async execute(): Promise<ProductListDto> {
    try {
      const cachedData = await this.cacheService.get(this.CACHE_KEY);
      if (cachedData) {
        const productList: ProductListDto = JSON.parse(
          cachedData,
        ) as ProductListDto;
        return productList;
      }
    } catch (error) {
      console.error('Error reading cache:', error);
    }

    const products = await this.productRepository.findAll();

    const productList = this.mapToSummaryDto(products);

    try {
      const dataToCache = JSON.stringify(productList);
      await this.cacheService.set(
        this.CACHE_KEY,
        dataToCache,
        this.CACHE_TTL_SECONDS,
      );
    } catch (error) {
      console.error('Error writing cache:', error);
    }

    return productList;
  }

  private mapToSummaryDto(products: Product[]): ProductListDto {
    const productDtos: ProductSummaryDto[] = products.map((product) => ({
      id: product.id,
      name: product.name,
    }));
    return { products: productDtos };
  }
}
