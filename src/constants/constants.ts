import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const jwtConstants = {
  secret: configService.get('JWT_SECRET'),
  expiresInAccess: '10s',
  expiresInRefresh: '10s',
};
