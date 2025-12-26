import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsersService } from 'src/users/users.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { JwtModule } from '@nestjs/jwt';
import { FileService } from 'src/file/file.service';

@Module({
  imports: [TypeOrmModule.forFeature([Users]), JwtModule],
  controllers: [ProfileController],
  providers: [
    ProfileService,
    UsersService,
    MailService,
    ConfigService,
    TokenService,
    FileService,
  ],
})
export class ProfileModule {}
