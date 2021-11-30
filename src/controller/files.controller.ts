import {
  Controller,
  Get,
  Param,
  Post,
  UseInterceptors,
  Res,
  HttpStatus,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { inject } from 'inversify';
import { UploadFileResponse } from 'src/interface/apiResponse';
import { Response } from 'express';

import { FilesService } from './../service/files.service';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(
    @inject(FilesService) private readonly filesService: FilesService
  ) {}

  @Get(':id')
  @ApiBearerAuth('authorization')
  async getHello(@Param('id') id: string): Promise<string> {
    return 'Hello' + id;
  }

  @Post('upload')
  @ApiBearerAuth('authorization')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async upload(@Res() res: Response, @UploadedFile() file: Express.Multer.File): Promise<UploadFileResponse> {
    if (file) {
      const { originalname, buffer } = file;
      try {
        await this.filesService.writeFileUser(originalname, buffer);
      } catch(err) {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        console.log(err);
        return { writtenFile: null };
      }
      return { writtenFile: originalname };
    }
    res.status(HttpStatus.BAD_REQUEST);
    return { writtenFile: null }
  }
}
