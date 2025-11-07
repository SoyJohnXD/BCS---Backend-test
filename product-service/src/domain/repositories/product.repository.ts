import { Product } from '../entities/product.entity';

export const IProductRepository = Symbol('IProductRepository');

export interface IProductRepository {
  /**
   * Guarda (crea o actualiza) un producto en la base de datos.
   * @param product La entidad Product que se va a guardar.
   */
  save(product: Product): Promise<void>;

  /**
   * Busca un producto por su ID único.
   * @param id El ID del producto.
   * @returns La entidad o null si no se encuentra.
   */
  findById(id: string): Promise<Product | null>;

  /**
   * Busca todos los productos.
   * @returns Un array de todas las entidades Product.
   */
  findAll(): Promise<Product[]>;
}
