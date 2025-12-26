import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { SubscriptionCharges } from 'src/entities/subscriptionCharges.entity';
import { SubChargesVariant } from 'src/entities/subChargesVarient.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ChargesVariantDto } from './dto/charge-variant.dto';
import { UpdateChargeVariantDto } from './dto/update-charge-variant.dto';
import { PriceCurrencyPair } from 'src/entities/priceCurrencyPair.entity';
import { PriceCurrencyPairDto } from './dto/price-currency.dto';
import { UpdatePriceCurrencyPairDto } from './dto/update-price-currency.dto';

@Injectable()
export class ChargesService {
  constructor(
    @InjectRepository(SubscriptionCharges)
    private ChargesRepo: Repository<SubscriptionCharges>,
    @InjectRepository(SubChargesVariant)
    private ChargesVariantRepo: Repository<SubChargesVariant>,
    @InjectRepository(PriceCurrencyPair)
    private priceCurrencyPair: Repository<PriceCurrencyPair>,
  ) {}

  async createCharge(createChargeDto: CreateChargeDto) {
    const create = this.ChargesRepo.create(createChargeDto);
    const save = await this.ChargesRepo.save(create);
    if (save) {
      return { message: 'Plan created successfully' };
    }
  }

  async createChargeVariant(chargesVariantDto: ChargesVariantDto) {
    const { subscriptionChargesId, ...rest } = chargesVariantDto;

    const charge = await this.ChargesRepo.findOneBy({
      id: subscriptionChargesId,
    });

    if (!charge) {
      throw new BadRequestException(
        'You are trying to create a variant for a charge that doesnt exist',
      );
    }

    const newObj = {
      ...rest,
      subscriptionCharges: charge,
    };
    const create = this.ChargesVariantRepo.create(newObj);

    const save = await this.ChargesVariantRepo.save(create);
    if (save) {
      return { message: 'Plan variant created successfully' };
    }
  }

  async createPriceCurrencyPair(data: PriceCurrencyPairDto) {
    const { variantId, ...rest } = data;

    const variant = await this.ChargesVariantRepo.findOneBy({
      id: variantId,
    });

    if (!variant) {
      throw new BadRequestException(
        'You are trying to create a price currency pair for a variant that doesnt exist',
      );
    }

    const newObj = {
      ...rest,
      subChargesVariant: variant,
    };
    const create = this.priceCurrencyPair.create(newObj);

    const save = await this.priceCurrencyPair.save(create);
    if (save) {
      return { message: 'Price currency pair created successfully' };
    }
  }

  findAll() {
    return this.ChargesRepo.find();
  }

  findOne(id: number) {
    return this.ChargesRepo.findOneBy({ id });
  }

  async update(id: number, updateChargeDto: UpdateChargeDto) {
    const charge = await this.ChargesRepo.findOneBy({ id });
    if (!charge) {
      throw new BadRequestException('Charge not found');
    }
    const update = await this.ChargesRepo.update(id, updateChargeDto);
    if (update) {
      return { message: 'Plan updated successfully' };
    }
  }

  async updateVariant(
    id: number,
    updateChargeVariantDto: UpdateChargeVariantDto,
  ) {
    if ('subscriptionChargesId' in updateChargeVariantDto) {
      throw new BadRequestException(
        'Subscription charges id cannot be updated',
      );
    }
    const chargeVariant = await this.ChargesVariantRepo.findOneBy({ id });
    if (!chargeVariant) {
      throw new BadRequestException('Charge variant not found');
    }
    const update = await this.ChargesVariantRepo.update(
      id,
      updateChargeVariantDto,
    );
    if (update) {
      return { message: 'Plan variant updated successfully' };
    }
  }

  async updatePriceCurrencyPair(
    id: number,
    updatePriceCurrency: UpdatePriceCurrencyPairDto,
  ) {
    if ('variantId' in updatePriceCurrency) {
      throw new BadRequestException('variant id cannot be updated');
    }
    const priceCurrency = await this.priceCurrencyPair.findOneBy({ id });
    if (!priceCurrency) {
      throw new BadRequestException('variant not found');
    }
    const update = await this.priceCurrencyPair.update(id, updatePriceCurrency);
    if (update) {
      return { message: 'Plan variant updated successfully' };
    }
  }
}
