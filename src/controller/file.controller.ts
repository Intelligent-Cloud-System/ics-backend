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
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

import {
  FileDeleteResponse,
  FileLinkResponse,
  FileResponse,
} from 'src/interface/apiResponse';
import { UploadFileSchema } from 'src/apischema/files.api.shema';
import { FileFormatter } from 'src/formatter/file.formatter';
import { FileService } from 'src/service/files.service';
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
    const { user } = req;
    const files = await this.fileService.getListFiles(user);
    return this.fileFormatter.toFilesResponse(files);
  }

  @Post('upload')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileResponse })
  @ApiConsumes('multipart/form-data')
  @ApiBody(UploadFileSchema)
  @UseInterceptors(FileInterceptor('file'))
  public async upload(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File
  ): Promise<FileResponse> {
    const { originalname, buffer } = file;
    const { user } = req;
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
    const { user } = req;
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
    @Req() req: Request,
    @Res() res: Response,
    @Param('fileLink') fileLink: string,
    @Query('iv') iv: string
  ): Promise<void> {
    const file = await this.fileService.getFileByLink(fileLink, iv);
    res.download(file.filePath);
  }

  @Delete('delete')
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileDeleteResponse })
  public async delete(
    @Req() req: Request,
    @Body() body: DeleteFileRequest
  ): Promise<Array<FileDeleteResponse>> {
    const { user } = req;
    const { ids } = body;
    const deletedFiles = await this.fileService.deleteFilesByIds(ids, user);
    return deletedFiles.map(this.fileFormatter.toFileDeleteResponse);
  }
}
