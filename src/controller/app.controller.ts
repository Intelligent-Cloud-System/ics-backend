import { inject } from 'inversify';
import { Controller, Get, Query } from '@nestjs/common';

import { AppService } from '../service/app.service';
import { provide } from 'inversify-binding-decorators';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller()
@provide(AppController)
export class AppController { 
  
  constructor(
    @inject(AppService) private readonly appService: AppService
  ) {
  }

  @Get('')
  @ApiBearerAuth('authorization')
  async getHello(
    @Query() test: string,
  ): Promise<string> {
    return this.appService.getHello();
  }
}
