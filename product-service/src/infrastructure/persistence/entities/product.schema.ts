import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text', name: 'short_description' })
  shortDescription: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'interest_rate' })
  interestRate: number;

  @Column({ type: 'text', name: 'terms_and_conditions' })
  termsAndConditions: string;

  @Column({
    type: 'jsonb',
    name: 'eligibility_requirements',
    default: () => "'[]'::jsonb",
  })
  eligibilityRequirements: string[];

  @Column({ type: 'jsonb', name: 'benefits', default: () => "'[]'::jsonb" })
  benefits: string[];

  @Column({ type: 'jsonb', name: 'image_tags', default: () => "'[]'::jsonb" })
  imageTags: string[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
