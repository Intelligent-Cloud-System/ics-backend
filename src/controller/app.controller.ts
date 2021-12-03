import { Controller, Get, Req, Logger } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AppService } from '../service/app.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiBearerAuth('authorization')
  public async getHello(@Req() req: Request): Promise<string> {
    this.logger.log('user', (req as any).user);
    return this.appService.getHello();
  }
}
