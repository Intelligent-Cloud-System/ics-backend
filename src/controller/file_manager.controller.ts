import {
  Req,
  Controller,
  HttpStatus,
  HttpCode,
  Post,
  Body,
} from '@nestjs/common';

import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Request } from '../shared/request';
import { FileManagerService } from '../service/file_manager/file_manager.service';
import { FileManagerFormatter } from '../service/file_manager/file_manager.formatter';
import { FolderResponse } from '../interface/apiResponse';
import { CreateFolderRequest } from '../interface/apiRequest';

@Controller('file_manager')
@ApiTags('FileManager')
export class FileManagerController {

  constructor(
    private readonly fileManagerService: FileManagerService,
    private readonly fileManagerFormatter: FileManagerFormatter,
  ) {
  }

  @Post('folder/create')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('authorization')
  @ApiResponse({ status: HttpStatus.OK, type: FolderResponse })
  public async createFolder(@Req() req: Request, @Body() body: CreateFolderRequest): Promise<FolderResponse> {
    const user = req.raw.user
    const folder = await this.fileManagerService.createFolder(user, body.location, body.name);

    return this.fileManagerFormatter.toFolderResponse(folder);
  }
}
