import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';
import { OnboardingStatus } from '@/domain/value-objects/onboarding-status.vo';

@Entity('onboarding_requests')
export class OnboardingRequestSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column({ unique: true })
  documento: string;

  @Column()
  email: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'monto_inicial' })
  montoInicial: number;

  @Column({
    type: 'enum',
    enum: OnboardingStatus,
    default: OnboardingStatus.REQUESTED,
  })
  status: OnboardingStatus;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
