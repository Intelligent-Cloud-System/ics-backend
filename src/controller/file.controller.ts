import {
  Req,
  Get,
  Body,
  Post,
  Param,
  Delete,
  Controller,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  Res,
  Query,
  HttpCode,
  StreamableFile,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import * as fs from 'fs';
import { FileFastifyInterceptor, MulterFile } from 'fastify-file-interceptor';
import { FastifyReply } from 'fastify';

import {
  FileDeleteResponse,
  FileLinkResponse,
  FileResponse,
} from 'src/interface/apiResponse';
import { UploadFileSchema } from 'src/apischema/files.api.shema';
import { FileFormatter } from 'src/formatter/file.formatter';
import { FileService } from 'src/service/file.service';
import { Request } from 'src/shared/request';
import { DeleteFileRequest } from 'src/interface/apiRequest';

@Controller('files')
@ApiTags('File')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileFormatter: FileFormatter
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: [FileResponse] })
  public async list(@Req() req: Request): Promise<FileResponse[]> {
    const { user } = req.raw;
    const files = await this.fileService.getListFiles(user);
    return this.fileFormatter.toFilesResponse(files);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody(UploadFileSchema)
  @UseInterceptors(FileFastifyInterceptor('file'))
  public async upload(
    @Req() req: Request,
    @UploadedFile() file: MulterFile
  ): Promise<FileResponse> {
    const { originalname, buffer } = file;
    const { user } = req.raw;
    const upsertedFile = await this.fileService.upsertFileUser(
      originalname,
      buffer,
      user
    );
    return this.fileFormatter.toFileResponse(upsertedFile);
  }

  @Get(':id/link')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileLinkResponse })
  public async getFileLink(
    @Req() req: Request,
    @Param('id') id: number
  ): Promise<FileLinkResponse> {
    const { user } = req.raw;
    const file = await this.fileService.getById(id);
    this.fileService.ensureFileBelongsToUser(file, user);

    const encryptFileInfo = this.fileService.getFileLink(file);

    return this.fileFormatter.toFileLinkResponse(
      encryptFileInfo.link,
      encryptFileInfo.iv
    );
  }

  @Get('download/:fileLink')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  public async download(
    @Res() res: FastifyReply,
    @Param('fileLink') fileLink: string,
    @Query('iv') iv: string
  ): Promise<void> {
    const file = await this.fileService.getFileByLink(fileLink, iv);

    // Temporary solution (must be replaced with a link from aws.s3)
    const stream = fs.createReadStream(file.filePath);
    res.type('stream').send(stream);
    // res.download(file.filePath);
  }

  @Delete('delete')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileDeleteResponse })
  public async delete(
    @Req() req: Request,
    @Body() body: DeleteFileRequest
  ): Promise<Array<FileDeleteResponse>> {
    const { user } = req.raw;
    const { ids } = body;
    const deletedFiles = await this.fileService.deleteFilesByIds(ids, user);
    return deletedFiles.map(this.fileFormatter.toFileDeleteResponse);
  }
}
