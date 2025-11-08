import { Product } from './product.entity';

describe('Product Entity', () => {
  const validProps = {
    name: 'Cuenta de Ahorros',
    description: 'Descripción completa',
    tasaInteres: 1.5,
    terminosCondiciones: 'Términos completos',
    requisitosElegibilidad: 'Requisitos completos',
  };

  it('should create a new product with valid properties', () => {
    const product = Product.create(validProps);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBeDefined();
    expect(product.name).toBe('Cuenta de Ahorros');
    expect(product.tasaInteres).toBe(1.5);
  });

  it('should throw an error if name is empty', () => {
    const invalidProps = {
      ...validProps,
      name: '  ',
    };

    expect(() => Product.create(invalidProps)).toThrow(
      'Product name is required',
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
      description: product.description,
      tasaInteres: product.tasaInteres,
      terminosCondiciones: product.terminosCondiciones,
      requisitosElegibilidad: product.requisitosElegibilidad,
      createdAt: product.createdAt,
    });
  });
});
