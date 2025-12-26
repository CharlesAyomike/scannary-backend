import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountType, ImageData, Users } from 'src/entities/users.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { TokenService } from 'src/token/token.service';
import { UpdateProfileDto } from 'src/profile/dto/update-profile.dto';
import { ILike } from 'typeorm';
import { RolesDto } from 'src/admin/dto/roles.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users) private userRepo: Repository<Users>,
    private mailService: MailService,
    private config: ConfigService,
    private tokenService: TokenService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const emailExist = await this.userRepo.findOne({
      where: { email: createUserDto.email },
    });
    if (emailExist) {
      throw new BadRequestException('Email already in use');
    }

    const numberExist = await this.userRepo.findOne({
      where: { phoneNumber: createUserDto.phoneNumber },
    });
    if (numberExist) {
      throw new BadRequestException('Phone number already in use');
    }

    const createUser = this.userRepo.create(createUserDto);
    const saverUser = await this.userRepo.save(createUser);
    if (saverUser) {
      const token = this.tokenService.generateToken(saverUser.email);
      const link = `${this.config.get('APP_URL')}/auth/verify-email?token=${token}`;

      void this.mailService.sendMail(
        createUserDto.email,
        createUserDto.firstName,
        'VERIFICATION_MAIL',
        {
          product_name: 'Scannary',
          link: link,
          name: `${createUserDto.firstName} ${createUserDto.lastName}`,
          team: 'Scannary',
        },
      );
      return {
        message: 'Account created successfully, kindly verify you mail.',
      };
    }
  }

  async markEmailVerified(email: string) {
    return await this.userRepo.update(
      { email },
      { emailVerifiedAt: new Date() },
    );
  }

  async updateProfilePic(id: number, imageDate: ImageData) {
    return await this.userRepo.update({ id }, { logo: imageDate });
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    return await this.userRepo.update({ id }, updateProfileDto);
  }

  async findOneByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async updatehashRefreshToken(
    userId: number,
    hashRefreshToken: string | null,
  ) {
    return this.userRepo.update({ id: userId }, { hashRefreshToken });
  }

  async findAll() {
    return this.userRepo.find();
  }

  async findUsers(
    page: number = 1,
    limit: number = 10,
    keyword: string | undefined,
  ) {
    const skip = (page - 1) * limit;

    let whereCondition: FindOptionsWhere<Users> | FindOptionsWhere<Users>[];
    whereCondition = { accountType: AccountType.USER };

    if (keyword) {
      const searchMatch = ILike(`%${keyword}%`);

      // TypeORM treats an array of objects as OR conditions
      whereCondition = [
        { ...whereCondition, firstName: searchMatch },
        { ...whereCondition, lastName: searchMatch },
        { ...whereCondition, email: searchMatch },
      ];
    }

    const [users, total] = await this.userRepo.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    if (total === 0) {
      throw new NotFoundException('No users found');
    }

    const sanitizedUsers = users.map((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, hashRefreshToken, ...userWithoutSensitiveData } = user;
      return userWithoutSensitiveData;
    });

    return {
      data: sanitizedUsers,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findAdmins(
    page: number = 1,
    limit: number = 10,
    keyword: string | undefined,
  ) {
    const skip = (page - 1) * limit;

    let whereCondition: FindOptionsWhere<Users> | FindOptionsWhere<Users>[];
    whereCondition = { accountType: AccountType.ADMIN };

    if (keyword) {
      const searchMatch = ILike(`%${keyword}%`);

      // TypeORM treats an array of objects as OR conditions
      whereCondition = [
        { ...whereCondition, firstName: searchMatch },
        { ...whereCondition, lastName: searchMatch },
        { ...whereCondition, email: searchMatch },
      ];
    }

    const [admins, total] = await this.userRepo.findAndCount({
      where: whereCondition,
      take: limit,
      skip: skip,
      order: { createdAt: 'DESC' },
    });

    if (total === 0) {
      throw new NotFoundException('No admins found');
    }

    const sanitizedAdmins = admins.map((admin) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, hashRefreshToken, ...userWithoutSensitiveData } = admin;
      return userWithoutSensitiveData;
    });

    return {
      data: sanitizedAdmins,
      meta: {
        total,
        page,
        lastPage: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  async findOne(id: number) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async remove(id: number) {
    return await this.userRepo.softDelete(id);
  }

  async blockUser(action: 'block' | 'unblock', id: number) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (action === 'block') {
      const block = await this.userRepo.update({ id }, { blocked: new Date() });
      if (block) {
        return { message: 'Account blocked successfully' };
      }
    } else if (action === 'unblock') {
      const block = await this.userRepo.update({ id }, { blocked: null });
      if (block) {
        return { message: 'Account unblocked successfully' };
      }
    } else {
      throw new BadRequestException('invalid action');
    }
  }

  async convert(action: 'toUser' | 'toAdmin', id: number, rolesDto: RolesDto) {
    const user = await this.userRepo.findOneBy({ id });

    if (!user) {
      throw new NotFoundException('user not found');
    }

    if (action === 'toAdmin') {
      const update = await this.userRepo.update(
        { id },
        { accountType: AccountType.ADMIN, roles: rolesDto.roles },
      );

      if (update) {
        return { message: 'Account type updated successfully' };
      }
    } else if (action === 'toUser') {
      const update = await this.userRepo.update(
        { id },
        { accountType: AccountType.USER, roles: rolesDto.roles },
      );

      if (update) {
        return { message: 'Account type updated successfully' };
      }
    } else {
      throw new BadRequestException('invalid action');
    }
  }
}
