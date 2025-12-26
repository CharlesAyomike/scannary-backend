import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ConfigModule } from '@nestjs/config';
import { Users } from 'src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionCharges } from 'src/entities/subscriptionCharges.entity';
import { Subscription } from 'src/entities/subscriptions.entity';
import { CountryCurrency } from 'src/entities/countryCurrency.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([
      Users,
      SubscriptionCharges,
      Subscription,
      CountryCurrency,
    ]),
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
})
export class PaymentModule {}
