import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Users } from './users.entity';

@Entity('userPaymentDetails')
export class UserPaymentDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  currency: string;

  @Column()
  cardAuth: string;

  @Column()
  cardName: string;

  @Column()
  lastForDigit: string;

  @Column()
  firstSixDigit: string;

  @Column()
  expDate: Date;

  @ManyToOne(() => Users, (user) => user.paymentDetails)
  user: Users;
}
