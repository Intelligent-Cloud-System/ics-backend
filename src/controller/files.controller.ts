import {
  Controller,
  Get,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  InternalServerErrorException,
  ConflictException,
  Param,
  StreamableFile,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

import { FileResponse } from '../interface/apiResponse';
import { FilesService } from '../service/files.service';
import { UploadFileShema } from '../apishema/files.api.shema';
import { bytesToSize, getFileName } from '../util/file.utils';
import { File } from '../model';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('all')
  @ApiBearerAuth('authorization')
  public async list(@Req() req: Request): Promise<FileResponse[]> {
    const user = (req as any).user;
    try {
      const files = (await this.filesService.getListFiles(user)) as File[];
      const res = files.map(
        (file): FileResponse => ({
          name: getFileName(file.filePath),
          size: bytesToSize(file.fileSize),
        })
      );
      return res;
    } catch (err) {
      throw new ConflictException(err);
    }
  }

  @Post('upload')
  @ApiBearerAuth('authorization')
  @ApiConsumes('multipart/form-data')
  @ApiBody(UploadFileShema)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ): Promise<FileResponse> {
    if (file) {
      const { originalname, buffer } = file;
      const user = (req as any).user;
      try {
        const file = await this.filesService.writeFileUser(
          originalname,
          buffer,
          user
        );
        return {
          name: getFileName(file.filePath),
          size: bytesToSize(file.fileSize),
        };
      } catch (err) {
        console.log(err);
        throw new InternalServerErrorException(err);
      }
    }
    throw new BadRequestException();
  }

  @Get('download/:filename')
  @ApiBearerAuth('authorization')
  public download(
    @Req() req: Request,
    @Param('filename') filename: string
  ): StreamableFile {
    const user = (req as any).user;
    const file = this.filesService.streamFileUser(filename, user);
    return new StreamableFile(file);
  }
}
