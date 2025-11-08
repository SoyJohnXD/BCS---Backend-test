import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
} from '@nestjs/common';
import { GetProductsUseCase } from '@/application/use-cases/get-products.use-case';
import { GetProductByIdUseCase } from '@/application/use-cases/get-product-by-id.use-case';
import { ProductListDto } from '@/application/dto/product-list.dto';
import { ProductDto } from '@/application/dto/product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly getProductsUseCase: GetProductsUseCase,
    private readonly getProductByIdUseCase: GetProductByIdUseCase,
  ) {}

  @Get()
  async getProducts(): Promise<ProductListDto> {
    return this.getProductsUseCase.execute();
  }

  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductDto> {
    const product = await this.getProductByIdUseCase.execute(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }
}
