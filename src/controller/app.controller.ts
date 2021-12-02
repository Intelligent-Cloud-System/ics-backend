import { Controller, Get, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiBearerAuth('authorization')
  async getHello(@Req() req: Request): Promise<string> {
    console.log('user', (req as any).user);
    return this.appService.getHello();
  }
}
