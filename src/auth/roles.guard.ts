import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/common/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [
        context.getHandler(), // The current method
        context.getClass(), // The current controller (optional)
      ],
    );

    if (!requiredRoles.length) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.userRole) return false;

    return requiredRoles.some((role) => user.userRole.includes(role));
  }
}
