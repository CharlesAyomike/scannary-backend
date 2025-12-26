import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { UserMailDto } from './dto/usermail.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { VerifyJwtPayload } from 'src/types/authJwtPayload';
import { Public } from 'src/auth/decorator/public.decorator';

@Controller('mail')
export class MailController {
  constructor(
    private readonly mailService: MailService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  @Public()
  @Post('resend-email-verification')
  async resendVerificationMail(@Body() userMailDto: UserMailDto) {
    const payLoad: VerifyJwtPayload = { sub: userMailDto.email };
    const token = this.jwtService.sign(payLoad);
    const link = `${this.config.get('APP_URL')}/auth/verify-email?token=${token}`;

    return this.mailService.sendMail(
      userMailDto.email,
      userMailDto.firstName,
      'VERIFICATION_MAIL',
      {
        product_name: 'Scannary',
        link: link,
        name: `${userMailDto.firstName} ${userMailDto.lastName}`,
        team: 'Scannary',
      },
    );
  }
}
