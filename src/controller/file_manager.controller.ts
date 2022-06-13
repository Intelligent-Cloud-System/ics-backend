import { Req, Controller, HttpStatus, HttpCode, Post, Body, Get, Query, Delete } from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Request } from '../shared/request';
import { FileManagerService } from '../service/file_manager/file_manager.service';
import { FileManagerFormatter } from '../service/file_manager/file_manager.formatter';
import {
  FolderResponse,
  FileManagerListResponse,
  SignedPostUrlsResponse,
  SignedGetUrlsResponse,
} from '../interface/apiResponse';
import {
  CreateFolderRequest,
  ReceiveUrlGetRequest,
  FileManagerDeleteRequest,
  ReceiveUrlPostRequest,
} from '../interface/apiRequest';
import { WebsocketService } from '../service/websocket/websocket.service';

@Controller('file_manager')
@ApiTags('FileManager')
export class FileManagerController {
  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly fileManagerFormatter: FileManagerFormatter,
    private readonly websocketService: WebsocketService,
  ) {}

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileManagerListResponse })
  public async list(@Req() { user }: Request, @Query('location') location: string): Promise<FileManagerListResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(location);
    const content = await this.fileManagerService.getContent(user, location);

    return this.fileManagerFormatter.toListResponse(content.folders, content.files);
  }

  @Post('folder/create')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.CREATED, type: FolderResponse })
  public async createFolder(@Req() { user }: Request, @Body() body: CreateFolderRequest): Promise<FolderResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);
    const folder = await this.fileManagerService.createFolder(user, body.location, body.name);

    await this.websocketService.emitUserMessage('FilesListUpdated', user.id);

    return this.fileManagerFormatter.toFolderResponse(folder);
  }

  @Delete('files/delete')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FileManagerListResponse })
  public async delete(
    @Req() { user }: Request,
    @Body() body: FileManagerDeleteRequest
  ): Promise<FileManagerListResponse> {
    const content = await this.fileManagerService.delete(user, body);

    await this.websocketService.emitUserMessage('FilesListUpdated', user.id);

    return this.fileManagerFormatter.toListResponse(content.folders, content.files);
  }

  @Post('/signed-urls/post')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: SignedPostUrlsResponse })
  public async getSignedPostUrls(
    @Req() { user }: Request,
    @Body() body: ReceiveUrlPostRequest
  ): Promise<SignedPostUrlsResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);

    const fileSignedPostUrls = await this.fileManagerService.getSignedPostUrls(user, body);
    return this.fileManagerFormatter.toPostUrlsResponse(fileSignedPostUrls);
  }

  @Post('/signed-urls/get')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: SignedGetUrlsResponse })
  public async getSignedGetUrls(
    @Req() { user }: Request,
    @Body() body: ReceiveUrlGetRequest
  ): Promise<SignedGetUrlsResponse> {
    this.fileManagerService.ensureLocationCanBeUsed(body.location);

    const fileSignedPostUrls = await this.fileManagerService.getSignedGetUrls(user, body);
    return this.fileManagerFormatter.toGetUrlsResponse(fileSignedPostUrls);
  }
}
