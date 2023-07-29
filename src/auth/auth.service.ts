import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UserDTO } from 'src/dto/user.dto';
import { compare } from 'bcrypt';
import { jwtConstants } from 'src/constants/constants';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async registerUser(data: CreateUserDTO): Promise<User | null> {
    return this.usersService.create(data);
  }

  async loginUser(data: UserDTO) {
    const user = await this.usersService.findOne(data.email);
    if (!user) {
      return null;
    }

    const passwordMatch = await compare(data.password, user.password);
    if (!passwordMatch) {
      return null;
    }

    const payload = { email: user.email, username: user.name, sub: user.id };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expiresInAccess,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expiresInRefresh,
    });

    return {
      access_token: access_token,
      refreshToken: refreshToken,
    };
  }

  async refreshToken(user: User) {
    const payload = {
      username: user.name,
      sub: user.id,
      email: user.email,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: jwtConstants.expiresInAccess,
    });

    return {
      accessToken: access_token,
    };
  }

  async validateUser(email: string): Promise<User> {
    return this.usersService.findOne(email);
  }
}
