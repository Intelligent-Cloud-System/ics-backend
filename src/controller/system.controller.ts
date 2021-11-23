import { Controller, Get, HttpCode, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('system')
export class SystemController {
  constructor() {}

  @Get('healthy')
  @HttpCode(HttpStatus.OK)
  healthy(@Res() res: Response): void {
    res.status(HttpStatus.OK).send();
  }
}
