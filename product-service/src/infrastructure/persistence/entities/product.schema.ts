import { Entity, Column, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity('products')
export class ProductSchema {
  @PrimaryColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'tasa_interes' })
  tasaInteres: number;

  @Column({ type: 'text', name: 'terminos_condiciones' })
  terminosCondiciones: string;

  @Column({ type: 'text', name: 'requisitos_elegibilidad' })
  requisitosElegibilidad: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
