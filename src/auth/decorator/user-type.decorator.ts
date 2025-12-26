import { metadata } from 'reflect-metadata/no-conflict';
import { AccountType } from 'src/entities/users.entity';

export const UserTypeKey: string = 'userTypes';
export const UserType = (...userTypes: [AccountType, ...AccountType[]]) =>
  metadata(UserTypeKey, userTypes);
