import {
  Column,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
} from 'typeorm';
import { SubChargesVariant } from './subChargesVarient.entity';

@Entity('priceCurrencyPair')
export class PriceCurrencyPair {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column()
  amount: number;

  @Column()
  flutterwaveId: number;

  @ManyToOne(
    () => SubChargesVariant,
    (subChargesVariant) => subChargesVariant.priceCurrencyPair,
  )
  subChargesVariant: SubChargesVariant;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
