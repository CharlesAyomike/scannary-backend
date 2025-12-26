import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import jwtEmailVerificationConfig from 'src/config/jwtTokenConfig';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync(jwtEmailVerificationConfig.asProvider()),
  ],
  controllers: [MailController],
  providers: [MailService],
})
export class MailModule {}
