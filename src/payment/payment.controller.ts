import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { UserType } from 'src/auth/decorator/user-type.decorator';
import { AccountType } from 'src/entities/users.entity';
import { Roles } from 'src/auth/decorator/role.decorator';
import { Roles as AllowedRoles } from 'src/entities/users.entity';
import { SubscribeDto } from './dto/subscribe.dto';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from 'src/auth/decorator/public.decorator';

@ApiBearerAuth('jwt-auth')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UserType(AccountType.USER)
  @Roles(AllowedRoles.User)
  @Post()
  subscribe(@Body() subscribeDto: SubscribeDto, @Req() req) {
    return this.paymentService.subscribe(subscribeDto, req.user.id);
  }

  @UserType(AccountType.USER)
  @Roles(AllowedRoles.User)
  @Get('get-subscription-history')
  getSubHistory(@Req() req) {
    return this.paymentService.getSubHistory(req.user.id);
  }

  @Public()
  @Post('web-hook')
  async webHookPayment(@Body() data: any) {
    return this.paymentService.webHookPayment(data);
  }
}
