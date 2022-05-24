import { Req, Controller, HttpStatus, HttpCode, Post, Body, Get, Query } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Request } from '../shared/request';
import { FileManagerService } from '../service/file_manager/file_manager.service';
import { FileManagerFormatter } from '../service/file_manager/file_manager.formatter';
import { FolderResponse, ListResponse, LinksResponse } from '../interface/apiResponse';
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
  public async list(@Req() { user }: Request, @Query('location') location: string): Promise<ListResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(location);
    const content = await this.fileManagerService.getContent(user, location);
    return this.fileManagerFormatter.toListResponse(content.folders, content.files);
  }

  @Post('folder/create')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FolderResponse })
  public async createFolder(@Req() { user }: Request, @Body() body: CreateFolderRequest): Promise<FolderResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);
    const folder = await this.fileManagerService.createFolder(user, body.location, body.name);
    return this.fileManagerFormatter.toFolderResponse(folder);
  }

  @Post('folder/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FolderResponse })
  public async deleteFolder(@Req() { user }: Request, @Body() body: DeleteFolderRequest): Promise<FolderResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.path);
    const folder = await this.fileManagerService.deleteFolder(user, body);
    return this.fileManagerFormatter.toFolderResponse(folder);
  }

  @Post('files/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FolderResponse })
  public async deleteFile(@Req() { user }: Request, @Body() body: DeleteFileRequest): Promise<FolderResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);
    const folder = await this.fileManagerService.deleteFile(user, body);
    return this.fileManagerFormatter.toFolderResponse(folder);
  }

  @Post('files/upload')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: LinksResponse })
  public async uploadFile(@Req() { user }: Request, @Body() body: UploadFileRequest): Promise<LinksResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);
    const links = await this.fileManagerService.uploadFiles(user, body);
    return this.fileManagerFormatter.toLinksResponse(links);
  }
}
