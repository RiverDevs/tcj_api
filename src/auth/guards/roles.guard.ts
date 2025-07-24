import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../schemas/user.schema';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());
    if (!requiredRoles) return true; // Si no hay roles definidos, permite el acceso

    const { user } = context.switchToHttp().getRequest();
    if (!user?.role) throw new ForbiddenException('Acceso denegado: rol no especificado');

    return requiredRoles.includes(user.role);
  }
}