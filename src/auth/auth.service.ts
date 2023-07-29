import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { UserDTO } from 'src/dto/user.dto';
import { compare } from 'bcrypt';

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
    const token = await this.jwtService.signAsync(payload);

    return {
      access_token: token,
    };
  }

  async validateUser(email: string): Promise<User> {
    return this.usersService.findOne(email);
  }
}
