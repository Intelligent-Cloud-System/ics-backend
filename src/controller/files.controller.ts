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

import { FileDeleteResponse, FileResponse } from 'src/interface/apiResponse';
import { UploadFileShema } from 'src/apishema/files.api.shema';
import { FilesFormatter } from 'src/formatter/file.formatter';
import { FilesService } from 'src/service/files.service';
import { Request } from 'src/shared/request';

@Controller('files')
@ApiTags('File')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly filesFormatter: FilesFormatter
  ) {}

  @Get('all')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: [FileResponse] })
  public async list(@Req() req: Request): Promise<FileResponse[]> {
    const { user } = req;
    const files = await this.filesService.getListFiles(user);
    return this.filesFormatter.toFilesResponce(files);
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
    const { user } = req;
    const upsertedFile = await this.filesService.upsertFileUser(
      originalname,
      buffer,
      user
    );
    return this.filesFormatter.toFileResponce(upsertedFile);
  }

  @Get('download/:id')
  @ApiBearerAuth('authorization')
  public async download(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<StreamableFile> {
    const { user } = req;
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
    const { user } = req;
    const deletedFile = await this.filesService.deleteFileUser(id, user);
    return this.filesFormatter.toFileDeleteResponce(deletedFile);
  }
}
