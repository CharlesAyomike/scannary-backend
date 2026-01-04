import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Outlet } from 'src/entities/outlet.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { PaymentService } from 'src/payment/payment.service';
import { ChargesService } from 'src/charges/charges.service';

@Injectable()
export class OutletService {
  constructor(
    private userService: UsersService,
    private paymentService: PaymentService,
    private subscription: ChargesService,
    @InjectRepository(Outlet) private outlet: Repository<Outlet>,
  ) {}
  async create(createOutletDto: CreateOutletDto, id: number) {
    const activeSub = await this.paymentService.getActiveSub(id);

    if (!activeSub) {
      throw new BadRequestException('You donnot have an active subscription');
    }

    //check if plan can create outlet

    const plan = await this.subscription.findOne(activeSub.chargesId);

    return 'This action adds a new outlet';
  }

  findAll() {
    return `This action returns all outlet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} outlet`;
  }

  update(id: number, updateOutletDto: UpdateOutletDto) {
    return `This action updates a #${id} outlet`;
  }

  remove(id: number) {
    return `This action removes a #${id} outlet`;
  }
}
