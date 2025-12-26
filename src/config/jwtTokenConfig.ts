import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: process.env.VERIFICATION_MAIL_JWT_TOKEN,
    signOptions: { expiresIn: '10m' },
  }),
);
