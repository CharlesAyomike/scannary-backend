import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from './users.entity';

export enum SUB_STATUS {
  ACTIVE = 'active',
  PENDIND = 'pending',
  EXPIRED = 'expired',
}

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chargesId: number;

  @Column()
  variantId: number;

  @Column()
  amount: number;

  @Column()
  currency: string;

  @Column({ default: 'unpaid' })
  paymentStatus: string;

  @Column({ default: Date.now().toString() })
  paymentRef: string;

  @Column({ type: 'enum', enum: SUB_STATUS, default: SUB_STATUS.PENDIND })
  subscriptionStatus: SUB_STATUS;

  @Column({ nullable: true })
  expireAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Users, (user) => user.subscriptions)
  user: Users;
}
