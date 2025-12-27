import { Injectable } from '@nestjs/common';
import { CreateOutletDto } from './dto/create-outlet.dto';
import { UpdateOutletDto } from './dto/update-outlet.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Outlet } from 'src/entities/outlet.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OutletService {
  constructor(
    private userService: UsersService,
    @InjectRepository(Outlet) private outlet: Repository<Outlet>,
  ) {}
  async create(createOutletDto: CreateOutletDto, id: number) {
    //get user sub (if its valid and not expired)
    const user = await this.userService.findOne(id);
    return 'This action adds a new outlet';
  }

  findAll() {
    return `This action returns all outlet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} outlet`;
  }

  update(id: number, updateOutletDto: UpdateOutletDto) {
    return `This action updates a #${id} outlet`;
  }

  remove(id: number) {
    return `This action removes a #${id} outlet`;
  }
}
