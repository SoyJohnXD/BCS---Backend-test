export interface ProductDto {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  interestRate: number;
  termsAndConditions: string;
  eligibilityRequirements: string[];
  benefits: string[];
  imageTags: string[];
}
