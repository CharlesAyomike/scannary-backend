import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { ImageData } from 'src/entities/users.entity';
import { CloudinaryResponse } from 'src/file/file.response';

@Injectable()
export class ProfileService {
  constructor(private userService: UsersService) {}

  async findOne(id: number) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashRefreshToken, ...rest } = user;

    return rest;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const update = await this.userService.update(id, updateProfileDto);

    if (update) {
      return {
        data: updateProfileDto,
        message: 'profile updated successfully',
      };
    }
  }

  async updateProfilePic(id: number, imageResponse: CloudinaryResponse) {
    let imageData: ImageData;

    if (imageResponse && 'secure_url' in imageResponse) {
      imageData = {
        imageUrl: imageResponse.secure_url,
        imageId: imageResponse.public_id,
      };
    } else {
      throw new BadRequestException('Failed to upload image');
    }
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const update = await this.userService.updateProfilePic(id, imageData);

    if (update) {
      return { data: imageData, message: 'image updated successfully' };
    }
  }

  async remove(id: number) {
    const user = await this.userService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const remove = await this.userService.remove(id);

    if (remove) {
      return { message: 'Your account has been deleted' };
    }
  }
}
