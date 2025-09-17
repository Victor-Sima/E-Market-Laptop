import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { usersData } from '../data/users.data';
import { User } from '../interfaces/user.interface';

// Extindem Request ca să recunoaștem user-ul
export interface RequestWithUser extends Request {
  user?: User;
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Preluăm rolurile necesare de la decoratorul @Roles()
    const requiredRoles = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );

    // Dacă nu sunt roluri specificate, permitem accesul
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // Preluăm request-ul și tipizăm corect
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const userIdHeader = request.headers['user-id'];

    // Validăm că există header-ul și că e un string, nu array
    if (!userIdHeader || Array.isArray(userIdHeader)) {
      throw new ForbiddenException('Invalid User ID in header');
    }

    // Convertim la număr și validăm
    const userId = parseInt(userIdHeader, 10);
    if (isNaN(userId)) {
      throw new ForbiddenException('User ID must be a number');
    }

    // Căutăm utilizatorul în baza de date simulată
    const user = usersData.find((u) => u.id === userId);
    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Verificăm dacă user-ul are rolul necesar
    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`,
      );
    }

    // Adăugăm user-ul în request pentru utilizări ulterioare
    request.user = user;

    return true;
  }
}
