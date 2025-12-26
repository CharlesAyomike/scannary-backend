import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubscriptionCharges } from './subscriptionCharges.entity';
import { PriceCurrencyPair } from './priceCurrencyPair.entity';

@Entity('subChargesVariant')
export class SubChargesVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  duration: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => PriceCurrencyPair,
    (priceCurrencyPair) => priceCurrencyPair.subChargesVariant,
    { eager: true },
  )
  priceCurrencyPair: PriceCurrencyPair[];

  @ManyToOne(
    () => SubscriptionCharges,
    (subscriptionCharges) => subscriptionCharges.variant,
  )
  subscriptionCharges: SubscriptionCharges;
}
