import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

@Entity('onboarding_requests')
export class OnboardingRequestSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  documentNumber: string;

  @Column()
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto_inicial' })
  initialAmount: number;

  @Column({
    type: 'enum',
    enum: OnboardingStatus,
    default: OnboardingStatus.REQUESTED,
  })
  status: OnboardingStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
