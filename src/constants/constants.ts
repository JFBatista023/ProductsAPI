import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

config();

const configService = new ConfigService();

export const jwtConstants = {
  secret: configService.get('JWT_SECRET'),
  expiresIn: '60s',
};
