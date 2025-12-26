import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RolesDto } from './dto/roles.dto';

@Injectable()
export class AdminService {
  constructor(private readonly userRepo: UsersService) {}

  findAllAdmin(page: number, limit: number, keyword: string | undefined) {
    return this.userRepo.findAdmins(+page, +limit, keyword);
  }

  findAllUsers(page: number, limit: number, keyword: string | undefined) {
    return this.userRepo.findUsers(+page, +limit, keyword);
  }

  async findById(id: number) {
    const user = await this.userRepo.findOne(id);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashRefreshToken, ...userWithoutSensitiveData } = user;

    return userWithoutSensitiveData;
  }

  async block(action: 'block' | 'unblock', id: number) {
    return await this.userRepo.blockUser(action, id);
  }

  convert(action: 'toUser' | 'toAdmin', id: number, rolesDto: RolesDto) {
    return this.userRepo.convert(action, id, rolesDto);
  }
}
