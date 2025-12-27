import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Users } from './users.entity';
import { OutletUsers } from './OutletUsers.entity';

@Entity('outlet')
export class Outlet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => OutletUsers, (outletUsers) => outletUsers.outlet)
  outletUsers: OutletUsers[];

  @ManyToOne(() => Users, (user) => user.outlet)
  owner: Users;
}
