import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { SubChargesVariant } from './subChargesVarient.entity';
import { PlanFeatures } from './planFeatures.entity';

@Entity('subscriptionCharges')
export class SubscriptionCharges {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(
    () => SubChargesVariant,
    (variant) => variant.subscriptionCharges,
    { eager: true },
  )
  variant: SubChargesVariant[];

  @OneToMany(() => PlanFeatures, (planFeatures) => planFeatures.plan, {
    eager: true,
  })
  planFeature: PlanFeatures[];
}
