import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { IProductRepository } from '@/domain/repositories/product.repository';
import { Product } from '@/domain/entities/product.entity';

@Injectable()
export class SeederService implements OnApplicationBootstrap {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async onApplicationBootstrap() {
    await this.seedProducts();
  }

  private async seedProducts() {
    const existingProducts = await this.productRepository.findAll();
    if (existingProducts.length > 0) {
      return;
    }

    console.log('Seeding products...');

    const productsToSeed: Product[] = [
      Product.create({
        nombre: 'Cuenta de Ahorros',
        descripcion: 'Una cuenta flexible para tus ahorros diarios.',
        tasaInteres: 1.25,
        terminosCondiciones: 'Aplica GMF 4x1000. Cuota de manejo: $0.',
        requisitosElegibilidad: 'Ser mayor de 18 años y tener cédula.',
      }),
      Product.create({
        nombre: 'Tarjeta de Crédito Clásica',
        descripcion: 'Tu primera tarjeta de crédito con cupo flexible.',
        tasaInteres: 34.5,
        terminosCondiciones: 'Cupo sujeto a estudio de crédito.',
        requisitosElegibilidad: 'Ingresos superiores a 1 SMMLV.',
      }),
      Product.create({
        nombre: 'Crédito de Libre Inversión',
        descripcion: 'Dinero para lo que necesites, con tasa fija.',
        tasaInteres: 22.0,
        terminosCondiciones: 'Plazo de 12 a 60 meses.',
        requisitosElegibilidad: 'Estudio de crédito y antigüedad laboral.',
      }),
    ];

    for (const product of productsToSeed) {
      await this.productRepository.save(product);
    }

    console.log('Products seeded successfully!');
  }
}
