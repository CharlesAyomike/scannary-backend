import { AccountType, Roles } from 'src/entities/users.entity';

export type CurrentUser = {
  id: number;
  accountType: AccountType;
  roles: Roles[];
};
