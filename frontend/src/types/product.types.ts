export interface ProductSummaryDto {
  id: string;
  name: string;
  shortDescription: string;
}

export interface ProductListDto {
  products: ProductSummaryDto[];
}
