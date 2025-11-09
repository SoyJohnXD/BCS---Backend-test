import { Product } from '@/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

export class ProductMapper {
  static toDomain(schema: ProductSchema): Product {
    return Product.fromPrimitives({
      id: schema.id,
      name: schema.name,
      shortDescription: schema.shortDescription,
      description: schema.description,
      createdAt: schema.createdAt,
      interestRate: Number(schema.interestRate),
      termsAndConditions: schema.termsAndConditions,
      eligibilityRequirements: schema.eligibilityRequirements ?? [],
      benefits: schema.benefits ?? [],
      imageTags: schema.imageTags ?? [],
    });
  }

  static toPersistence(entity: Product): ProductSchema {
    const primitives = entity.toPrimitives();
    const schema = new ProductSchema();

    schema.id = primitives.id;
    schema.name = primitives.name;
    schema.shortDescription = primitives.shortDescription;
    schema.description = primitives.description;
    schema.createdAt = primitives.createdAt;
    schema.interestRate = primitives.interestRate as unknown as number;
    schema.termsAndConditions = primitives.termsAndConditions;
    schema.eligibilityRequirements = primitives.eligibilityRequirements ?? [];
    schema.benefits = primitives.benefits ?? [];
    schema.imageTags = primitives.imageTags ?? [];

    return schema;
  }
}
