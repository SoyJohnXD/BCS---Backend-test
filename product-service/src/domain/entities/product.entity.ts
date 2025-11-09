import { randomUUID } from 'crypto';
import { InvalidProductNameException } from '@/domain/exceptions/invalid-product-name.exception';
import { MissingShortDescriptionException } from '@/domain/exceptions/missing-short-description.exception';

export interface CreateProductProps {
  name: string;
  shortDescription: string;
  description: string;
  interestRate: number;
  termsAndConditions: string;
  eligibilityRequirements?: string[];
  benefits?: string[];
  imageTags?: string[];
}

export interface ProductProps extends CreateProductProps {
  id: string;
  createdAt: Date;
  eligibilityRequirements: string[];
  benefits: string[];
  imageTags: string[];
}

export class Product {
  private readonly _id: string;
  private _name: string;
  private _shortDescription: string;
  private _description: string;
  private readonly _createdAt: Date;
  private _interestRate: number;
  private _termsAndConditions: string;
  private _eligibilityRequirements: string[];
  private _benefits: string[];
  private _imageTags: string[];

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._shortDescription = props.shortDescription;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._interestRate = props.interestRate;
    this._termsAndConditions = props.termsAndConditions;
    this._eligibilityRequirements = props.eligibilityRequirements ?? [];
    this._benefits = props.benefits ?? [];
    this._imageTags = props.imageTags ?? [];
  }

  public static create(props: CreateProductProps): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new InvalidProductNameException();
    }
    if (!props.shortDescription || props.shortDescription.trim().length === 0) {
      throw new MissingShortDescriptionException();
    }

    return new Product({
      id: randomUUID(),
      name: props.name.trim(),
      shortDescription: props.shortDescription.trim(),
      description: props.description,
      createdAt: new Date(),
      interestRate: props.interestRate,
      termsAndConditions: props.termsAndConditions,
      eligibilityRequirements: props.eligibilityRequirements ?? [],
      benefits: props.benefits ?? [],
      imageTags: props.imageTags ?? [],
    });
  }

  public static fromPrimitives(props: ProductProps): Product {
    return new Product({
      ...props,
      eligibilityRequirements: props.eligibilityRequirements ?? [],
      benefits: props.benefits ?? [],
      imageTags: props.imageTags ?? [],
    });
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get shortDescription(): string {
    return this._shortDescription;
  }
  get description(): string {
    return this._description;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get interestRate(): number {
    return this._interestRate;
  }
  get termsAndConditions(): string {
    return this._termsAndConditions;
  }
  get eligibilityRequirements(): string[] {
    return [...this._eligibilityRequirements];
  }
  get benefits(): string[] {
    return [...this._benefits];
  }
  get imageTags(): string[] {
    return [...this._imageTags];
  }

  public toPrimitives() {
    return {
      id: this._id,
      name: this._name,
      shortDescription: this._shortDescription,
      description: this._description,
      createdAt: this._createdAt,
      interestRate: this._interestRate,
      termsAndConditions: this._termsAndConditions,
      eligibilityRequirements: [...this._eligibilityRequirements],
      benefits: [...this._benefits],
      imageTags: [...this._imageTags],
    };
  }
}
