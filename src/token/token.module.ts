import { Module } from '@nestjs/common';
import { TokenService } from './token.service';
import { JwtModule } from '@nestjs/jwt';
import jwtTokenConfig from 'src/config/jwtTokenConfig';

@Module({
  imports: [JwtModule.registerAsync(jwtTokenConfig.asProvider())],
  providers: [TokenService],
})
export class TokenModule {}
