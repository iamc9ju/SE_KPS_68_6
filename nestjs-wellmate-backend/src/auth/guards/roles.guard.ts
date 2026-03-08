import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Observable } from 'rxjs';
import { UserRole } from '@prisma/client';
import type { Request } from 'express';
import { JwtPayload } from '../interface/jwt-payload.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      throw new ForbiddenException(
        'Access denied: No role permissions defined for this endpoint.',
      );
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user as JwtPayload | undefined;
    if (!user || !user.role) {
      throw new ForbiddenException('User context or role not found');
    }

    const hasRole = requiredRoles.includes(user.role as UserRole);

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied: Requires one of roles [${requiredRoles.join(', ')}]`,
      );
    }
    return true;
  }
}
