import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

export class SimpleResponse {
  @ApiProperty()
  a: number;
}

@Controller('system')
@ApiTags('System')
export class SystemController {
  constructor() {}

  @Post('healthy')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({ status: HttpStatus.OK, type: SimpleResponse})
  async healthy(
    @Query('test1') test1: string,
    // @Res() res: Response,
  ): Promise<SimpleResponse> {
    console.log({ test1 });
    return { a: 10 };
    // res.status(HttpStatus.OK).send();
  }
}
