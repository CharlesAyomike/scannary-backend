import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserTypeKey } from 'src/auth/decorator/user-type.decorator';
import { AccountType } from 'src/entities/users.entity';
import { CurrentUser } from 'src/types/currentUser';

@Injectable()
export class UsertypesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredUserType = this.reflector.getAllAndOverride<AccountType[]>(
      UserTypeKey,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredUserType) return true;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const user = context.switchToHttp().getRequest().user as CurrentUser;
    const hasRequiredAccountType = requiredUserType.some(
      (types) => user.accountType === types,
    );

    return hasRequiredAccountType;
  }
}
