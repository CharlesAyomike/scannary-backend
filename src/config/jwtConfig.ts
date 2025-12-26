import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.ACCESS_TOKEN_KEY,
    signOptions: { expiresIn: '1h' },
  }),
);
