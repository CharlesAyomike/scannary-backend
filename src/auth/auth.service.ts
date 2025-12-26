import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import refreshJwtConfig from 'src/config/refreshJwtConfig';
import { TokenService } from 'src/token/token.service';
import { AuthJwtPayload } from 'src/types/authJwtPayload';
import { UsersService } from 'src/users/users.service';
import * as argon2 from 'argon2';
import { compare } from 'bcrypt';
import { CurrentUser } from 'src/types/currentUser';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private tokenService: TokenService,
    @Inject(refreshJwtConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshJwtConfig>,
  ) {}

  register(createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }

    if (user.blocked !== null) {
      throw new BadRequestException(
        'This account has been blocked, contact admin for more enquires.',
      );
    }

    const isPasswordMatch = await compare(password, user.password);
    if (!isPasswordMatch) {
      throw new BadRequestException('Invalid Credentials');
    }

    return {
      id: user.id,
      accountType: user.accountType,
      role: user.roles,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      createdAt: user.createdAt,
    };
  }

  async login(userId: number) {
    const { accessToken, refreshToken } = await this.tokenGenerator(userId);
    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updatehashRefreshToken(userId, hashRefreshToken);
    return { id: userId, accessToken, refreshToken };
  }

  async tokenGenerator(userId: number) {
    const payLoad: AuthJwtPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payLoad),
      this.jwtService.signAsync(payLoad, this.refreshTokenConfig),
    ]);

    return { accessToken, refreshToken };
  }

  async verifyEmailToken(token: string) {
    try {
      const payload = this.tokenService.verifyToken(token);
      if (!payload) {
        throw new BadRequestException('Invalid or expired verification link');
      }
      await this.userService.markEmailVerified(payload.sub);
      return { message: 'Email verified successfully' };
    } catch (err) {
      this.logger.error(`Failed to verify email token: ${token}`, err);
      throw new BadRequestException('Invalid or expired verification link');
    }
  }

  async refreshToken(userId: number) {
    const { accessToken, refreshToken } = await this.tokenGenerator(userId);
    const hashRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updatehashRefreshToken(userId, hashRefreshToken);
    return { id: userId, accessToken, refreshToken };
  }

  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user || !user.hashRefreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    const isRefreshTokenMatch = await argon2.verify(
      user.hashRefreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatch) {
      throw new UnauthorizedException('Invalid refresh token');
    }
    return { id: userId };
  }

  async signOut(userId: number) {
    await this.userService.updatehashRefreshToken(userId, null);
    return { message: 'User signed out successfully' };
  }

  async validateJwtUser(id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('user not found');
    }
    const currentUser: CurrentUser = {
      id: user.id,
      accountType: user.accountType,
      roles: user.roles,
    };

    return currentUser;
  }
}
