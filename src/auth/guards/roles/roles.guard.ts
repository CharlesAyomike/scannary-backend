import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesKey } from 'src/auth/decorator/role.decorator';
import { Roles } from 'src/entities/users.entity';
import { CurrentUser } from 'src/types/currentUser';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(RolesKey, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = context.switchToHttp().getRequest().user as CurrentUser;

    const userRoleIsAllowed = user.roles.some((role) =>
      requiredRoles.includes(role),
    );
    return userRoleIsAllowed;
  }
}
