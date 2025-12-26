import { Module } from '@nestjs/common';
import { CountryCurrencyService } from './country-currency.service';
import { CountryCurrencyController } from './country-currency.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CountryCurrency } from 'src/entities/countryCurrency.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CountryCurrency])],
  controllers: [CountryCurrencyController],
  providers: [CountryCurrencyService],
})
export class CountryCurrencyModule {}
