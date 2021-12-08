import {
  Req,
  Get,
  Post,
  Param,
  Delete,
  Controller,
  HttpStatus,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
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
  constructor(private readonly filesService: FilesService) {}

  @Get('all')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: [FileResponse] })
  public async list(@Req() req: Request): Promise<FileResponse[]> {
    const user = req.user;
    const files = (await this.filesService.getListFiles(user)) as File[];
    const res = files.map(
      (file): FileResponse => ({
        id: file.id,
        name: getFileName(file.filePath),
        size: bytesToSize(file.fileSize),
      })
    );
    return res;
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
    const { originalname, buffer } = file;
    const user = req.user;
    const usertedFile = await this.filesService.upsertFileUser(
      originalname,
      buffer,
      user
    );
    return {
      id: usertedFile.id,
      name: getFileName(usertedFile.filePath),
      size: bytesToSize(usertedFile.fileSize),
    };
  }

  @Get('download/:id')
  @ApiBearerAuth('authorization')
  public async download(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<StreamableFile> {
    const user = req.user;
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
    const user = req.user;
    const deletedFile = await this.filesService.deleteFileUser(id, user);
    return {
      id: deletedFile.id,
    };
  }
}
