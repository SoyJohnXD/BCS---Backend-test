import { randomUUID } from 'crypto';
import { OnboardingStatus } from '../value-objects/onboarding-status.vo';

export interface CreateOnboardingRequestProps {
  nombre: string;
  documento: string;
  email: string;
  montoInicial: number;
}

export interface OnboardingRequestProps extends CreateOnboardingRequestProps {
  id: string;
  status: OnboardingStatus;
  createdAt: Date;
}

export class OnboardingRequest {
  private readonly _id: string;
  private _nombre: string;
  private _documento: string;
  private _email: string;
  private _montoInicial: number;
  private _status: OnboardingStatus;
  private readonly _createdAt: Date;

  private constructor(props: OnboardingRequestProps) {
    this._id = props.id;
    this._nombre = props.nombre;
    this._documento = props.documento;
    this._email = props.email;
    this._montoInicial = props.montoInicial;
    this._status = props.status;
    this._createdAt = props.createdAt;
  }

  public static create(props: CreateOnboardingRequestProps): OnboardingRequest {
    if (props.montoInicial < 0) {
      throw new Error('El monto inicial no puede ser negativo');
    }

    return new OnboardingRequest({
      id: randomUUID(),
      nombre: props.nombre,
      documento: props.documento,
      email: props.email,
      montoInicial: props.montoInicial,
      status: OnboardingStatus.REQUESTED,
      createdAt: new Date(),
    });
  }

  public static fromPrimitives(
    props: OnboardingRequestProps,
  ): OnboardingRequest {
    return new OnboardingRequest(props);
  }

  get id(): string {
    return this._id;
  }

  get status(): OnboardingStatus {
    return this._status;
  }

  get nombre(): string {
    return this._nombre;
  }

  get documento(): string {
    return this._documento;
  }

  get email(): string {
    return this._email;
  }

  get montoInicial(): number {
    return this._montoInicial;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  public toPrimitives() {
    return {
      id: this._id,
      nombre: this._nombre,
      documento: this._documento,
      email: this._email,
      montoInicial: this._montoInicial,
      status: this._status,
      createdAt: this._createdAt,
    };
  }
}
