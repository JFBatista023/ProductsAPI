import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { Role } from 'src/entities/roles.entity';
import { User } from 'src/entities/user.entity';
import { RoleNames } from 'src/enums/roles.enum';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) {}

  async findOne(email: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ email });
  }

  async create(user: CreateUserDTO): Promise<User | null> {
    const userExists = await this.findOne(user.email);
    if (userExists) {
      return null;
    }

    const passwordHashed = await hash(user.password, 10);
    user.password = passwordHashed;

    const newUser = this.usersRepository.create({
      name: user.name,
      email: user.email,
      password: passwordHashed,
      roles: [],
    });

    if (user.roles) {
      for (const role of Object.values(user.roles)) {
        const rolesForUser = await this.rolesRepository.findOneBy({
          name: role,
        });

        newUser.roles.push(rolesForUser);
      }
    } else {
      const rolesForUser = await this.rolesRepository.findOneBy({
        name: RoleNames.USER,
      });

      newUser.roles.push(rolesForUser);
    }

    return this.usersRepository.save(newUser);
  }
}
