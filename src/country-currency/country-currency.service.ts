import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCountryCurrencyDto } from './dto/create-country-currency.dto';
import { UpdateCountryCurrencyDto } from './dto/update-country-currency.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CountryCurrency } from 'src/entities/countryCurrency.entity';

@Injectable()
export class CountryCurrencyService {
  constructor(
    @InjectRepository(CountryCurrency)
    private countryCurrency: Repository<CountryCurrency>,
  ) {}
  async create(createCountryCurrencyDto: CreateCountryCurrencyDto) {
    const create = this.countryCurrency.create(createCountryCurrencyDto);
    const save = await this.countryCurrency.save(create);

    if (save) {
      return { message: 'country currency created successfully' };
    }
  }

  async findAll() {
    return await this.countryCurrency.find();
  }

  async findOne(id: number) {
    return await this.countryCurrency.findOneBy({ id });
  }

  async update(id: number, updateCountryCurrencyDto: UpdateCountryCurrencyDto) {
    const country = await this.countryCurrency.findOneBy({ id });

    if (!country) {
      throw new BadRequestException('this country does not exist');
    }

    const update = await this.countryCurrency.update(
      id,
      updateCountryCurrencyDto,
    );

    if (update) {
      return { message: 'country updated successfully' };
    }
  }

  async remove(id: number) {
    const country = await this.countryCurrency.findOneBy({ id });

    if (!country) {
      throw new BadRequestException('this country does not exist');
    }

    const remove = await this.countryCurrency.remove(country);

    if (remove) {
      return { message: 'country deleted successfully' };
    }
  }
}
