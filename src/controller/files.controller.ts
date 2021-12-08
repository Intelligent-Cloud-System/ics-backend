import {
  Req,
  Get,
  Post,
  Param,
  Delete,
  Logger,
  Controller,
  HttpStatus,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
  ConflictException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { FileDeleteResponse, FileResponse } from '../interface/apiResponse';
import { FilesService } from '../service/files.service';
import { UploadFileShema } from '../apishema/files.api.shema';
import { bytesToSize, getFileName } from '../shared/util/file.utils';
import { File } from '../model';
import { Request } from 'src/shared/request';

@Controller('files')
@ApiTags('File')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(private readonly filesService: FilesService) {}

  @Get('all')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: [FileResponse] })
  public async list(@Req() req: Request): Promise<FileResponse[]> {
    const user = (req as any).user;
    try {
      const files = (await this.filesService.getListFiles(user)) as File[];
      const res = files.map(
        (file): FileResponse => ({
          id: file.id,
          name: getFileName(file.filePath),
          size: bytesToSize(file.fileSize),
        })
      );
      return res;
    } catch (err) {
      this.logger.error(err);
      throw new ConflictException(err);
    }
  }

  @Post('upload')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileResponse })
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
        const file = await this.filesService.upsertFileUser(
          originalname,
          buffer,
          user
        );
        return {
          id: file.id,
          name: getFileName(file.filePath),
          size: bytesToSize(file.fileSize),
        };
      } catch (err) {
        throw new InternalServerErrorException(err);
      }
    }
    throw new BadRequestException();
  }

  @Get('download/:id')
  @ApiBearerAuth('authorization')
  public async download(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<StreamableFile> {
    const user = (req as any).user;
    const file = await this.filesService.streamFileUser(id, user);
    return new StreamableFile(file);
  }

  @Delete('delete/:id')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileDeleteResponse })
  public async delete(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<FileDeleteResponse> {
    const user = (req as any).user;
    const deletedFile = await this.filesService.deleteFileUser(id, user);
    return {
      id: deletedFile.id,
    };
  }
}
