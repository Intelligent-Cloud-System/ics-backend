import { Controller, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { SimpleResponse } from 'src/interface/apiResponse';

@Controller('system')
@ApiTags('System')
export class SystemController {
  constructor() {}

  @Post('healthy')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SimpleResponse })
  async healthy(@Query('test') test: number): Promise<SimpleResponse> {
    return { a: test };
  }
}
