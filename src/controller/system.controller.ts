import { Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('system')
@ApiTags('System')
export class SystemController {
  constructor() {}

  @Post('healthy')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK })
  @ApiBearerAuth('authorization')
  async healthy(
    @Res() res: Response,
  ): Promise<void> {
    res.status(HttpStatus.OK).send();
  }
}
