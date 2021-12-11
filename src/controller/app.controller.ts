import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { AppService } from 'src/service/app.service';
import { ApplicationError } from 'src/shared/error/applicationError';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('')
  @ApiBearerAuth('authorization')
  public async getHello(): Promise<string> {
    return this.appService.getHello();
  }
}

export class TestError extends ApplicationError {}
