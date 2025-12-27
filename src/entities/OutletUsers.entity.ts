import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Outlet } from './outlet.entity';

export enum Roles {
  Manager = 'manager',
  Server = 'server',
  Waiter = 'waiter',
  BarTender = 'bar tender',
}

@Entity('outletUsers')
export class OutletUsers {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  pinHash: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: [Roles.Waiter],
    array: true,
  })
  roles: Roles[];

  @Column({ nullable: true })
  isActive: Date;

  @ManyToOne(() => Outlet, (outlet) => outlet.outletUsers)
  outlet: Outlet;

  @BeforeInsert()
  async hashPin() {
    this.pinHash = await bcrypt.hash(this.pinHash, 10);
  }
}
