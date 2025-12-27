import { Module } from '@nestjs/common';
import { OutletService } from './outlet.service';
import { OutletController } from './outlet.controller';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { Outlet } from 'src/entities/outlet.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Users, Outlet]), JwtModule],
  controllers: [OutletController],
  providers: [
    OutletService,
    UsersService,
    UsersService,
    MailService,
    ConfigService,
    TokenService,
  ],
})
export class OutletModule {}
