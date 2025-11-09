import { randomUUID } from 'crypto';
import { OnboardingStatus } from '../value-objects/onboarding-status.vo';
import { OnboardingRequestFinalizedException } from '../exceptions/onboarding-request-finalized.exception';

export interface CreateOnboardingRequestProps {
  name: string;
  documentNumber: string;
  email: string;
  initialAmount: number;
  productId: string;
  createdByUserId: string;
}

export interface OnboardingRequestProps extends CreateOnboardingRequestProps {
  id: string;
  status: OnboardingStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class OnboardingRequest {
  private readonly _id: string;
  private _name: string;
  private _documentNumber: string;
  private _email: string;
  private _initialAmount: number;
  private _status: OnboardingStatus;
  private readonly _createdAt: Date;
  private _updatedAt: Date;
  private _productId: string;
  private _createdByUserId: string;

  private constructor(props: OnboardingRequestProps) {
    this._id = props.id;
    this._name = props.name;
    this._documentNumber = props.documentNumber;
    this._email = props.email;
    this._initialAmount = props.initialAmount;
    this._status = props.status;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
    this._productId = props.productId;
    this._createdByUserId = props.createdByUserId;
  }

  public static create(props: CreateOnboardingRequestProps): OnboardingRequest {
    if (props.initialAmount < 0) {
      throw new Error('Initial amount cannot be negative');
    }

    const now = new Date();
    return new OnboardingRequest({
      id: randomUUID(),
      name: props.name,
      documentNumber: props.documentNumber,
      email: props.email,
      initialAmount: props.initialAmount,
      status: OnboardingStatus.REQUESTED,
      createdAt: now,
      updatedAt: now,
      productId: props.productId,
      createdByUserId: props.createdByUserId,
    });
  }

  public updateStatus(
    newStatus: OnboardingStatus.APPROVED | OnboardingStatus.REJECTED,
  ): void {
    if (
      this._status === OnboardingStatus.APPROVED ||
      this._status === OnboardingStatus.REJECTED
    ) {
      throw new OnboardingRequestFinalizedException(this._id, this._status);
    }

    this._status = newStatus;
    this._updatedAt = new Date();
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

  get name(): string {
    return this._name;
  }

  get documentNumber(): string {
    return this._documentNumber;
  }

  get email(): string {
    return this._email;
  }

  get initialAmount(): number {
    return this._initialAmount;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get productId(): string {
    return this._productId;
  }

  get createdByUserId(): string {
    return this._createdByUserId;
  }

  public toPrimitives() {
    return {
      id: this._id,
      name: this._name,
      documentNumber: this._documentNumber,
      email: this._email,
      initialAmount: this._initialAmount,
      status: this._status,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      productId: this._productId,
      createdByUserId: this._createdByUserId,
    };
  }
}
