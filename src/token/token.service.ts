import { Logger, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { VerifyJwtPayload } from 'src/types/authJwtPayload';

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  constructor(private jwtService: JwtService) {}

  generateToken(data: string) {
    const payload: VerifyJwtPayload = { sub: data };
    return this.jwtService.sign(payload);
  }

  verifyToken(token: string): VerifyJwtPayload | null {
    try {
      return this.jwtService.verify<VerifyJwtPayload>(token);
    } catch (error) {
      this.logger.error(error);
      return null;
    }
  }
}
