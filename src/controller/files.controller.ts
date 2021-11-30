import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { inject } from 'inversify';
import {
  ListFilesResponse,
  UploadFileResponse,
} from 'src/interface/apiResponse';

import { FilesService } from './../service/files.service';
import { UploadFileShema } from 'src/apishema/files.api.shema';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(
    @inject(FilesService) private readonly filesService: FilesService
  ) {}

  @Get('all')
  @ApiBearerAuth('authorization')
  async list(): Promise<ListFilesResponse> {
    try {
      const files = await this.filesService.getListFiles();
      return { files };
    } catch (err) {
      throw new ConflictException(err);
    }
  }

  @Post('upload')
  @ApiBearerAuth('authorization')
  @ApiConsumes('multipart/form-data')
  @ApiBody(UploadFileShema)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File
  ): Promise<UploadFileResponse> {
    if (file) {
      const { originalname, buffer } = file;
      try {
        await this.filesService.writeFileUser(originalname, buffer);
        return { writtenFile: originalname };
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }
    throw new BadRequestException();
  }
}
