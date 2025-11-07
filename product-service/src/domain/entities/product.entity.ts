import { randomUUID } from 'crypto';

export interface CreateProductProps {
  nombre: string;
  descripcion: string;
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
  private _nombre: string;
  private _descripcion: string;
  private readonly _createdAt: Date;
  private _tasaInteres: number;
  private _terminosCondiciones: string;
  private _requisitosElegibilidad: string;

  private constructor(props: ProductProps) {
    this._id = props.id;
    this._nombre = props.nombre;
    this._descripcion = props.descripcion;
    this._createdAt = props.createdAt;
    this._tasaInteres = props.tasaInteres;
    this._terminosCondiciones = props.terminosCondiciones;
    this._requisitosElegibilidad = props.requisitosElegibilidad;
  }

  public static create(props: CreateProductProps): Product {
    if (!props.nombre || props.nombre.trim().length === 0) {
      throw new Error('El nombre del producto es requerido');
    }

    return new Product({
      id: randomUUID(),
      nombre: props.nombre,
      descripcion: props.descripcion,
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
  get nombre(): string {
    return this._nombre;
  }
  get descripcion(): string {
    return this._descripcion;
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
      nombre: this._nombre,
      descripcion: this._descripcion,
      createdAt: this._createdAt,
      tasaInteres: this._tasaInteres,
      terminosCondiciones: this._terminosCondiciones,
      requisitosElegibilidad: this._requisitosElegibilidad,
    };
  }
}
