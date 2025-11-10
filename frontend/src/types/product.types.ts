export interface ProductSummaryDto {
  id: string;
  name: string;
  shortDescription: string;
  /** Tags opcionales provenientes del backend (si existen) */
  tags?: string[];
}

export interface ProductListDto {
  products: ProductSummaryDto[];
}

export interface ProductDetailDto {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  interestRate?: number;
  termsAndConditions?: string;
  eligibilityRequirements?: string[];
  benefits?: string[];
  imageTags?: string[];
}
