import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from 'src/constants/constants';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { RefreshJwtStrategy } from './strategies/jwt/refresh.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
    }),
  ],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
