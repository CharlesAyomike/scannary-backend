import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubscriptionCharges } from './subscriptionCharges.entity';

@Entity('planFeature')
export class PlanFeatures {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @ManyToOne(
    () => SubscriptionCharges,
    (subscriptionCharges) => subscriptionCharges.planFeature,
  )
  plan: SubscriptionCharges;
}
