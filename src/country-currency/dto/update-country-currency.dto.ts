import { PartialType } from '@nestjs/swagger';
import { CreateCountryCurrencyDto } from './create-country-currency.dto';

export class UpdateCountryCurrencyDto extends PartialType(CreateCountryCurrencyDto) {}
