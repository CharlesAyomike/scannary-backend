import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { MoreThan, Repository } from 'typeorm';
import { SubscriptionCharges } from 'src/entities/subscriptionCharges.entity';
import { SUB_STATUS, Subscription } from 'src/entities/subscriptions.entity';
import { ConfigService } from '@nestjs/config';
import {
  FlutterwaveResponse,
  FlutterwaveWebhookEvent,
} from 'src/types/flutterwave';
import { CountryCurrency } from 'src/entities/countryCurrency.entity';

@Injectable()
export class PaymentService {
  private readonly secreteKey: string;
  private readonly baseUrl: string;
  private readonly callback: string;

  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(SubscriptionCharges)
    private charges: Repository<SubscriptionCharges>,
    @InjectRepository(Subscription)
    private subscription: Repository<Subscription>,
    private configService: ConfigService,
    @InjectRepository(CountryCurrency)
    private countryCurrency: Repository<CountryCurrency>,
  ) {
    this.baseUrl = this.configService.get<string>('FLUTTERWAVE_BASE_URL') || '';
    this.secreteKey =
      this.configService.get<string>('FLUTTERWAVE_SECRET_KEY') || '';
    this.callback = this.configService.get<string>('APP_URL') || '';
  }

  async initiatePayment(data: {
    amount: number;
    currency: string;
    tx_ref: string;
    payment_plan?: number;
    payment_options: string;
    redirect_url: string;
    customer: {
      name?: string;
      email: string;
      phonenumber?: string;
    };
    customizations: {
      title: string;
    };
    meta: {
      transaction: number;
      type: string;
    };
  }) {
    try {
      const res = await fetch(`${this.baseUrl}/payments`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.secreteKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = (await res.json()) as FlutterwaveResponse;

      if (!res.ok) {
        throw new HttpException(
          result?.message || 'Payment initiation failed',
          res.status,
        );
      }

      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to initiate payment';
      throw new HttpException(errorMessage, HttpStatus.BAD_REQUEST);
    }
  }

  async subscribe(subscribeDto: SubscribeDto, userId: number) {
    const user = await this.usersRepo.findOneBy({ id: userId });

    if (!user) {
      throw new BadRequestException('Unable to find user');
    }

    const charges = await this.charges.findOneBy({
      id: subscribeDto.subscriptionChargesId,
    });

    if (!charges) {
      throw new BadRequestException('Subscription plan does not exist');
    }

    const variantExist = charges.variant.find(
      (v) => v.id === subscribeDto.subChargesVariantId,
    );

    if (!variantExist) {
      throw new BadRequestException('Subscription variant does not exist');
    }

    //get user currency
    let userCurrency: string;

    const currency = await this.countryCurrency.findOneBy({
      countryName: user.country,
    });
    if (!currency) {
      userCurrency = 'USD';
    } else {
      userCurrency = currency.currency;
    }

    //get variant price currency pair
    const priceCurrencyPairOfUser = variantExist.priceCurrencyPair.find(
      (cp) => cp.currency === userCurrency,
    );

    const data = {
      chargesId: subscribeDto.subscriptionChargesId,
      variantId: subscribeDto.subChargesVariantId,
      amount: priceCurrencyPairOfUser?.amount,
      currency: userCurrency,
      user,
    };

    const createSub = this.subscription.create(data);
    const saveSub = await this.subscription.save(createSub);

    if (!saveSub) {
      throw new BadRequestException('Unable to initiate subscription');
    }

    const paymentData = await this.initiatePayment({
      amount: saveSub.amount,
      currency: saveSub.currency,
      tx_ref: saveSub.paymentRef,
      ...(subscribeDto.autoRenew && {
        payment_plan: priceCurrencyPairOfUser?.flutterwaveId,
      }),
      payment_options: 'card, mobilemoney, ussd',
      redirect_url: this.callback,
      customer: {
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        phonenumber: user.phoneNumber,
      },
      customizations: {
        title: 'Scannery',
      },
      meta: {
        transaction: saveSub.id,
        type: 'subscription',
      },
    });

    return { data: paymentData };
  }

  calculateSubscriptionEnd(
    currentEnd: Date | null,
    interval: 'month' | 'year',
    count: number,
  ): Date {
    const base =
      currentEnd && currentEnd > new Date() ? new Date(currentEnd) : new Date();

    if (interval === 'month') {
      base.setMonth(base.getMonth() + count);
    }

    if (interval === 'year') {
      base.setFullYear(base.getFullYear() + count);
    }

    return base;
  }

  async getSubHistory(userId: number) {
    const history = await this.subscription.find({
      where: {
        user: { id: userId },
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return { data: history };
  }

  async getActiveSub(userId: number) {
    const activeSub = await this.subscription.findOne({
      where: {
        user: { id: userId },
        subscriptionStatus: SUB_STATUS.ACTIVE,
        expireAt: MoreThan(new Date()),
      },
      order: {
        createdAt: 'DESC',
      },
    });

    if (!activeSub) {
      throw new BadRequestException('no active subscription');
    }

    return activeSub;
  }

  async webHookPayment(data: FlutterwaveWebhookEvent) {
    if (data.meta_data?.type === 'subscription') {
      const sub = await this.subscription.findOneBy({
        id: data.meta_data.transaction,
      });

      const charges = await this.charges.findOneBy({ id: sub?.chargesId });
      const variant = charges?.variant.find((v) => v.id === sub?.variantId);
      //use duration if user is not an auto renew else use flutterwave exp date
      // const duration = variant?.duration;
      if (variant) {
        const newEnd = this.calculateSubscriptionEnd(
          sub?.expireAt ?? null,
          variant?.interval,
          variant.intervalCount,
        );
        console.log(data);
        if (sub) {
          const update = await this.subscription.update(
            { id: data.meta_data.transaction },
            {
              paymentStatus: data.data.status,
              subscriptionStatus: SUB_STATUS.ACTIVE,
              // expireAt:
            },
          );
        }
      }
    }
  }
}
