import { Module } from '@nestjs/common';
import { ChargesService } from './charges.service';
import { ChargesController } from './charges.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionCharges } from 'src/entities/subscriptionCharges.entity';
import { SubChargesVariant } from 'src/entities/subChargesVarient.entity';
import { PriceCurrencyPair } from 'src/entities/priceCurrencyPair.entity';
import { PlanFeatures } from 'src/entities/planFeatures.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SubscriptionCharges,
      SubChargesVariant,
      PriceCurrencyPair,
      PlanFeatures,
    ]),
  ],
  controllers: [ChargesController],
  providers: [ChargesService],
})
export class ChargesModule {}
