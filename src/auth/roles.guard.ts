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

    if (!requiredRoles) {
      return true;
    } //if user role is undefined.. ie) if route guard not used.

    if (!requiredRoles.length) return false; //if user role is null.. ie) if route guard with empty roles.

    const { user } = context.switchToHttp().getRequest();

    if (!user || !user.userRole) return false;

    //to access control to admin to all controllers except user Controller
    if (
      user.userRole.toLowerCase() === 'admin' &&
      context.getClass().name !== 'UserDetailsController'
    ) {
      return true;
    }

    return requiredRoles.some((role) =>
      user.userRole.toLowerCase().includes(role.toLowerCase()),
    );
  }
}
