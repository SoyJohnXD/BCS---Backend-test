import { Product } from './product.entity';

describe('Product Entity', () => {
  const validProps = {
    nombre: 'Cuenta de Ahorros',
    descripcion: 'Descripción completa',
    tasaInteres: 1.5,
    terminosCondiciones: 'Términos completos',
    requisitosElegibilidad: 'Requisitos completos',
  };

  it('should create a new product with valid properties', () => {
    const product = Product.create(validProps);

    expect(product).toBeInstanceOf(Product);
    expect(product.id).toBeDefined();
    expect(product.nombre).toBe('Cuenta de Ahorros');
    expect(product.tasaInteres).toBe(1.5);
  });

  it('should throw an error if nombre is empty', () => {
    const invalidProps = {
      ...validProps,
      nombre: '  ',
    };

    expect(() => Product.create(invalidProps)).toThrow(
      'El nombre del producto es requerido',
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
    expect(product.descripcion).toBe(primitives.descripcion);
  });

  it('should convert the entity to primitives', () => {
    const product = Product.create(validProps);
    const primitives = product.toPrimitives();

    expect(primitives).toEqual({
      id: product.id,
      nombre: product.nombre,
      descripcion: product.descripcion,
      tasaInteres: product.tasaInteres,
      terminosCondiciones: product.terminosCondiciones,
      requisitosElegibilidad: product.requisitosElegibilidad,
      createdAt: product.createdAt,
    });
  });
});
