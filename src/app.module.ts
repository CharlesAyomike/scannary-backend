import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from './mail/mail.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AdminModule } from './admin/admin.module';
import { TokenModule } from './token/token.module';
import { ChargesModule } from './charges/charges.module';
import { PaymentModule } from './payment/payment.module';
import { ProfileModule } from './profile/profile.module';
import { CountryCurrencyModule } from './country-currency/country-currency.module';
import { FileModule } from './file/file.module';
import pgConfig from './config/pgConfig';

@Module({
  imports: [
    UsersModule,
    MailModule,
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [pgConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: pgConfig,
    }),
    AuthModule,
    AdminModule,
    TokenModule,
    ChargesModule,
    PaymentModule,
    ProfileModule,
    CountryCurrencyModule,
    FileModule,
  ],
})
export class AppModule {}
