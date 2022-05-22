import { Req, Controller, HttpStatus, HttpCode, Post, Body, Get, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Request } from '../shared/request';
import { FileManagerService } from '../service/file_manager/file_manager.service';
import { FileManagerFormatter } from '../service/file_manager/file_manager.formatter';
import {
  DeleteFileResponse,
  DeleteFolderResponse,
  FolderResponse,
  ListResponse,
  UploadFileResponse,
} from '../interface/apiResponse';
import {
  CreateFolderRequest,
  DeleteFileRequest,
  DeleteFolderRequest,
  UploadFileRequest,
} from '../interface/apiRequest';

@Controller('file_manager')
@ApiTags('FileManager')
export class FileManagerController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly fileManagerFormatter: FileManagerFormatter
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: ListResponse })
  public async list(@Req() { raw: { user } }: Request, @Query('location') location: string): Promise<ListResponse> {
    const content = await this.fileManagerService.getContent(user, location);

    return this.fileManagerFormatter.toListResponse(content.folders, content.files);
  }

  @Post('folder/create')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FolderResponse })
  public async createFolder(@Req() req: Request, @Body() body: CreateFolderRequest): Promise<FolderResponse> {
    const user = req.raw.user;
    const folder = await this.fileManagerService.createFolder(user, body.location, body.name);

    return this.fileManagerFormatter.toFolderResponse(folder);
  }

  @Post('folder/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: DeleteFolderResponse })
  public async deleteFolder(@Req() req: Request, @Body() body: DeleteFolderRequest): Promise<DeleteFolderResponse> {
    const user = req.raw.user;
    return this.fileManagerService.deleteFolder(user, body);
  }

  @Post('files/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: DeleteFileResponse })
  public async deleteFile(@Req() req: Request, @Body() body: DeleteFileRequest): Promise<DeleteFileResponse> {
    const user = req.raw.user;
    return this.fileManagerService.deleteFile(user, body);
  }

  @Post('files/upload')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: UploadFileResponse })
  public async uploadFile(@Req() req: Request, @Body() body: UploadFileRequest): Promise<UploadFileResponse> {
    const user = req.raw.user;
    return this.fileManagerService.uploadFiles(user, body);
  }
}
