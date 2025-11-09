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
        name: 'Savings Account',
        shortDescription: 'Flexible account for everyday savings.',
        description:
          'A flexible savings account with no maintenance fees and competitive rate.',
        interestRate: 1.25,
        termsAndConditions: 'Subject to local taxes. No maintenance fee.',
        eligibilityRequirements: ['18+ years old', 'Valid ID'],
        benefits: ['No maintenance fee', 'Online banking access'],
        imageTags: ['savings', 'piggy-bank'],
      }),
      Product.create({
        name: 'Classic Credit Card',
        shortDescription: 'Your first credit card with flexible limit.',
        description:
          'Credit card designed for starters with rewards and manageable limits.',
        interestRate: 34.5,
        termsAndConditions: 'Credit limit subject to approval.',
        eligibilityRequirements: ['Proof of income', 'Credit check'],
        benefits: ['Rewards program', 'Contactless payments'],
        imageTags: ['credit-card', 'shopping'],
      }),
      Product.create({
        name: 'Personal Loan',
        shortDescription: 'Money for anything you need.',
        description: 'Fixed-rate personal loan from 12 to 60 months.',
        interestRate: 22.0,
        termsAndConditions: 'Subject to credit study.',
        eligibilityRequirements: ['Employment history', 'Credit check'],
        benefits: ['Fixed rate', 'Flexible terms'],
        imageTags: ['loan', 'cash'],
      }),
    ];

    for (const product of productsToSeed) {
      await this.productRepository.save(product);
    }

    console.log('Products seeded successfully!');
  }
}
