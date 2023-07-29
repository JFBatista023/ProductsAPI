import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PERMISSIONS_KEY } from 'src/decorators/permissions.decorator';
import { User } from 'src/entities/user.entity';
import { RolePermissions } from 'src/enums/roles.enum';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<
      RolePermissions[]
    >(PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredPermissions) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    const user = await this.getUserFromToken(token);

    const userPermissions: RolePermissions[] = [];

    user.roles.forEach((role) => {
      role.permissions.forEach((permission) => {
        userPermissions.push(permission);
      });
    });

    const hasRequiredPermissions = requiredPermissions.every((permission) =>
      userPermissions.includes(permission),
    );

    if (!hasRequiredPermissions) {
      throw new UnauthorizedException(
        'You do not have the permissions for this.',
      );
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    const authHeader = request.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring('Bearer '.length);
    }
    return null;
  }

  private async getUserFromToken(token: string): Promise<User | null> {
    try {
      const userEmail = this.getUserEmailFromToken(token);
      const user = await this.usersService.findOne(userEmail);
      return user;
    } catch (error) {
      return null;
    }
  }

  private getUserEmailFromToken(token: string): string | null {
    try {
      const decodedToken: any = this.jwtService.decode(token);
      return decodedToken.email;
    } catch (error) {
      return null;
    }
  }
}
