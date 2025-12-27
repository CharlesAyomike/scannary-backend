import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Subscription } from './subscriptions.entity';
import { UserPaymentDetails } from './usersPaymentDetail.entity';
import { Outlet } from './outlet.entity';

export enum AccountType {
  USER = 'user',
  ADMIN = 'admin',
}

export enum Roles {
  Accountant = 'accountant',
  Operator = 'opertaor',
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superAdmin',
}

export type ImageData = {
  imageUrl: string;
  imageId: string;
};

@Entity('users')
@Index(['email'], { unique: true, where: '"deletedAt" IS NULL' })
@Index(['phoneNumber'], { unique: true, where: '"deletedAt" IS NULL' })
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'json', nullable: true })
  logo: ImageData;

  @Column({ default: null })
  country: string;

  @Column({ unique: true })
  phoneNumber: string;

  @Column({ type: 'timestamp', nullable: true })
  blocked: Date | null;

  @Column({ type: 'enum', enum: AccountType, default: AccountType.USER })
  accountType: AccountType;

  @Column({
    type: 'enum',
    enum: Roles,
    default: [Roles.User],
    array: true,
  })
  roles: Roles[];

  @Column({ type: 'timestamp', nullable: true })
  emailVerifiedAt: Date | null;

  @Column({
    type: 'text',
    nullable: true,
    default: null,
  })
  hashRefreshToken: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deletedAt: Date | null;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];
  //may remove this(paymentDetails)
  @OneToMany(() => UserPaymentDetails, (paymentDetails) => paymentDetails.user)
  paymentDetails: UserPaymentDetails[];

  @OneToMany(() => Outlet, (outlet) => outlet.owner)
  outlet: Outlet[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @BeforeUpdate()
  updateTimestamp() {
    this.updatedAt = new Date();
  }
}
