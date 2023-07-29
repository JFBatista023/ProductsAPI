import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UnauthorizedException,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UserDTO } from 'src/dto/user.dto';
import { RefreshJwtGuard } from './strategies/jwt/refresh-jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new ValidationPipe({ transform: true })) data: CreateUserDTO,
  ) {
    const userCreated = await this.authService.registerUser(data);
    if (!userCreated) {
      throw new ConflictException('E-mail already registered.');
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ValidationPipe({ transform: true })) data: UserDTO) {
    const userExists = await this.authService.loginUser(data);
    if (!userExists) {
      throw new UnauthorizedException(
        'User does not exist. Check if email and password are correct.',
      );
    }
    return userExists;
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user);
  }
}
