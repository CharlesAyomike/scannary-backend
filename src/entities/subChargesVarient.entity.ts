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

export enum INTERVAL {
  Month = 'month',
  Year = 'year',
}

@Entity('subChargesVariant')
export class SubChargesVariant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: INTERVAL,
    default: [INTERVAL.Month],
  })
  interval: INTERVAL;

  @Column()
  intervalCount: number;

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
