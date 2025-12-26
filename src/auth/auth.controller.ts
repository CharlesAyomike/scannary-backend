import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { VerifyMailDto } from './dto/verify-mail.dto';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { Public } from './decorator/public.decorator';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  @ApiBody({ type: LoginUserDto })
  async login(@Request() req) {
    const { accessToken, refreshToken } = await this.authService.login(
      req.user.id,
    );
    return { ...req.user, accessToken, refreshToken };
  }

  @Public()
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Public()
  @Post('verify-email')
  async verifyEmail(@Body() verifyMailDto: VerifyMailDto) {
    return await this.authService.verifyEmailToken(verifyMailDto.token);
  }

  @ApiBearerAuth('jwt-auth')
  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refresh(@Req() req) {
    return this.authService.refreshToken(req.user.id);
  }

  @ApiBearerAuth('jwt-auth')
  @Post('sign-out')
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}
