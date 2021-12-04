import { Controller, Get, Req, Logger } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request } from 'express';

import { AppService } from '../service/app.service';
import { ApplicationError } from 'src/shared/error/applicationError';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);

  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiBearerAuth('authorization')
  public async getHello(@Req() req: Request): Promise<string> {
    return this.appService.getHello();
  }
}

export class TestError extends ApplicationError {};
