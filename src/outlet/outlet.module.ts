import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Outlet } from 'src/entities/outlet.entity';
import { PaymentService } from 'src/payment/payment.service';
import { SubscriptionCharges } from 'src/entities/subscriptionCharges.entity';
import { Subscription } from 'src/entities/subscriptions.entity';
import { CountryCurrency } from 'src/entities/countryCurrency.entity';
import { ChargesService } from 'src/charges/charges.service';
import { SubChargesVariant } from 'src/entities/subChargesVarient.entity';
import { PriceCurrencyPair } from 'src/entities/priceCurrencyPair.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Users,
      Outlet,
      SubscriptionCharges,
      Subscription,
      SubChargesVariant,
      PriceCurrencyPair,
      CountryCurrency,
    ]),
    JwtModule,
  ],
  controllers: [OutletController],
  providers: [
    OutletService,
    UsersService,
    UsersService,
    MailService,
    ConfigService,
    TokenService,
    PaymentService,
    ChargesService,
  ],
})
export class OutletModule {}
