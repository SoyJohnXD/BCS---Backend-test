import { Product } from './product.entity';
import { InvalidProductNameException } from '@/domain/exceptions/invalid-product-name.exception';
import { MissingShortDescriptionException } from '@/domain/exceptions/missing-short-description.exception';

describe('Product Entity', () => {
  const validProps = {
    name: 'Savings Account',
    shortDescription: 'Flexible savings account',
    description: 'Full long description',
    interestRate: 1.5,
    termsAndConditions: 'Full terms',
    eligibilityRequirements: ['18+', 'Valid ID'],
    benefits: ['No fees'],
    imageTags: ['savings', 'money'],
  };

  it('should create a new product with valid properties', () => {
    const product = Product.create(validProps);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBeDefined();
    expect(product.name).toBe(validProps.name);
    expect(product.interestRate).toBe(1.5);
    expect(product.shortDescription).toBe(validProps.shortDescription);
    expect(product.benefits).toEqual(['No fees']);
  });

  it('should throw an error if name is empty', () => {
    const invalidProps = { ...validProps, name: '  ' };
    expect(() => Product.create(invalidProps)).toThrow(
      InvalidProductNameException,
    );
  });

  it('should throw if shortDescription empty', () => {
    const invalidProps = { ...validProps, shortDescription: '   ' };
    expect(() => Product.create(invalidProps)).toThrow(
      MissingShortDescriptionException,
    );
  });

  it('should reconstitute a product from primitives', () => {
    const primitives = {
      id: 'a-valid-uuid',
      createdAt: new Date(),
      ...validProps,
    };
    const product = Product.fromPrimitives(primitives);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBe(primitives.id);
    expect(product.description).toBe(primitives.description);
  });

  it('should convert the entity to primitives', () => {
    const product = Product.create(validProps);
    const primitives = product.toPrimitives();
    expect(primitives).toEqual({
      id: product.id,
      name: product.name,
      shortDescription: product.shortDescription,
      description: product.description,
      createdAt: product.createdAt,
      interestRate: product.interestRate,
      termsAndConditions: product.termsAndConditions,
      eligibilityRequirements: product.eligibilityRequirements,
      benefits: product.benefits,
      imageTags: product.imageTags,
    });
  });
});
