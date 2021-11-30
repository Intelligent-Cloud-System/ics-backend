import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FilesService } from './../service/files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { inject } from 'inversify';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(
    @inject(FilesService) private readonly filesService: FilesService
  ) {}

  @Get(':id')
  @ApiBearerAuth('authorization')
  async getHello(@Param('id') id: string): Promise<string> {
    await this.filesService.writeFileUser('ss', Buffer.from('aa'));
    return 'Hello' + id;
  }

  @Post()
  @ApiBearerAuth('authorization')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    if (file) {
      const { originalname, buffer } = file;
      try {
        await this.filesService.writeFileUser(originalname, buffer);
      } catch (error) {
        return { error };
      }
    }
  }
}
