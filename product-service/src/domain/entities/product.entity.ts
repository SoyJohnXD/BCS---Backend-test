import { randomUUID } from 'crypto';

export interface CreateProductProps {
  name: string;
  description: string;
  tasaInteres: number;
  terminosCondiciones: string;
  requisitosElegibilidad: string;
}

export interface ProductProps extends CreateProductProps {
  id: string;
  createdAt: Date;
}

export class Product {
  private readonly _id: string;
  private _name: string;
  private _description: string;
  private readonly _createdAt: Date;
  private _tasaInteres: number;
  private _terminosCondiciones: string;
  private _requisitosElegibilidad: string;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._name = props.name;
    this._description = props.description;
    this._createdAt = props.createdAt;
    this._tasaInteres = props.tasaInteres;
    this._terminosCondiciones = props.terminosCondiciones;
    this._requisitosElegibilidad = props.requisitosElegibilidad;
  }

  public static create(props: CreateProductProps): Product {
    if (!props.name || props.name.trim().length === 0) {
      throw new Error('Product name is required');
    }

    return new Product({
      id: randomUUID(),
      name: props.name,
      description: props.description,
      createdAt: new Date(),

      tasaInteres: props.tasaInteres,
      terminosCondiciones: props.terminosCondiciones,
      requisitosElegibilidad: props.requisitosElegibilidad,
    });
  }

  public static fromPrimitives(props: ProductProps): Product {
    return new Product(props);
  }

  get id(): string {
    return this._id;
  }
  get name(): string {
    return this._name;
  }
  get description(): string {
    return this._description;
  }
  get createdAt(): Date {
    return this._createdAt;
  }

  get tasaInteres(): number {
    return this._tasaInteres;
  }
  get terminosCondiciones(): string {
    return this._terminosCondiciones;
  }
  get requisitosElegibilidad(): string {
    return this._requisitosElegibilidad;
  }

  public toPrimitives() {
    return {
      id: this._id,
      name: this._name,
      description: this._description,
      createdAt: this._createdAt,
      tasaInteres: this._tasaInteres,
      terminosCondiciones: this._terminosCondiciones,
      requisitosElegibilidad: this._requisitosElegibilidad,
    };
  }
}
