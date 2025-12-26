import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from 'src/file/file.service';
import { ImageData } from 'src/entities/users.entity';

@ApiBearerAuth('jwt-auth')
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly fileService: FileService,
  ) {}

  @Get()
  findOne(@Req() req) {
    return this.profileService.findOne(req.user.id);
  }

  @Patch()
  update(@Req() req, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(req.user.id, updateProfileDto);
  }

  @Patch('picture')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  async updateProfilePic(
    @Req() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const imageResponse = await this.fileService.uploadToCloudinary(file);

    return this.profileService.updateProfilePic(req.user.id, imageResponse);
  }

  @Delete()
  remove(@Req() req) {
    return this.profileService.remove(req.user.id);
  }
}
