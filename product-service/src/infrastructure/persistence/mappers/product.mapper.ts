import { Product } from '@/domain/entities/product.entity';
import { ProductSchema } from '../entities/product.schema';

export class ProductMapper {
  static toDomain(schema: ProductSchema): Product {
    return Product.fromPrimitives({
      id: schema.id,
      nombre: schema.nombre,
      descripcion: schema.descripcion,
      createdAt: schema.createdAt,
      tasaInteres: Number(schema.tasaInteres),
      terminosCondiciones: schema.terminosCondiciones,
      requisitosElegibilidad: schema.requisitosElegibilidad,
    });
  }

  static toPersistence(entity: Product): ProductSchema {
    const primitives = entity.toPrimitives();
    const schema = new ProductSchema();

    schema.id = primitives.id;
    schema.nombre = primitives.nombre;
    schema.descripcion = primitives.descripcion;
    schema.createdAt = primitives.createdAt;
    schema.tasaInteres = primitives.tasaInteres;
    schema.terminosCondiciones = primitives.terminosCondiciones;
    schema.requisitosElegibilidad = primitives.requisitosElegibilidad;

    return schema;
  }
}
