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
        name: 'Cuenta de Ahorros',
        shortDescription: 'Cuenta flexible para tus ahorros diarios.',
        description:
          'Una cuenta de ahorros flexible, sin comisiones de mantenimiento y con una tasa competitiva.',
        interestRate: 1.25,
        termsAndConditions:
          'Sujeta a impuestos locales. Sin comisión de mantenimiento.',
        eligibilityRequirements: ['Mayor de 18 años', 'Identificación válida'],
        benefits: ['Sin comisión de mantenimiento', 'Acceso a banca en línea'],
        imageTags: ['ahorros', 'alcancía'],
      }),
      Product.create({
        name: 'Tarjeta de Crédito Clásica',
        shortDescription: 'Tu primera tarjeta de crédito con límite flexible.',
        description:
          'Tarjeta de crédito diseñada para principiantes, con recompensas y límites manejables.',
        interestRate: 34.5,
        termsAndConditions: 'El límite de crédito está sujeto a aprobación.',
        eligibilityRequirements: [
          'Comprobante de ingresos',
          'Verificación de crédito',
        ],
        benefits: ['Programa de recompensas', 'Pagos sin contacto'],
        imageTags: ['tarjeta-de-credito', 'compras'],
      }),
      Product.create({
        name: 'Préstamo Personal',
        shortDescription: 'Dinero para lo que necesites.',
        description: 'Préstamo personal a tasa fija de 12 a 60 meses.',
        interestRate: 22.0,
        termsAndConditions: 'Sujeto a estudio de crédito.',
        eligibilityRequirements: [
          'Historial laboral',
          'Verificación de crédito',
        ],
        benefits: ['Tasa fija', 'Plazos flexibles'],
        imageTags: ['prestamo', 'efectivo'],
      }),
      Product.create({
        name: 'Plan de Inversión',
        shortDescription: 'Haz crecer tu dinero con opciones de bajo riesgo.',
        description:
          'Un plan de inversión con portafolios diversificados de bajo riesgo y aportes flexibles.',
        interestRate: 5.8,
        termsAndConditions:
          'Los rendimientos pueden variar según las condiciones del mercado.',
        eligibilityRequirements: [
          'Identificación válida',
          'Depósito inicial requerido',
        ],
        benefits: [
          'Reinversión automática',
          'Seguimiento del portafolio en línea',
        ],
        imageTags: ['inversion', 'crecimiento'],
      }),
      Product.create({
        name: 'Billetera Digital',
        shortDescription: 'Tu dinero, siempre contigo.',
        description:
          'Una billetera digital segura para enviar, recibir y administrar tus fondos al instante.',
        interestRate: 0.0,
        termsAndConditions:
          'Requiere instalación y verificación en la aplicación.',
        eligibilityRequirements: [
          'Teléfono inteligente',
          'Conexión a internet',
        ],
        benefits: ['Transferencias instantáneas', 'Pagos con código QR'],
        imageTags: ['billetera-digital', 'pago-movil'],
      }),
    ];

    for (const product of productsToSeed) {
      await this.productRepository.save(product);
    }

    console.log('Products seeded successfully!');
  }
}
