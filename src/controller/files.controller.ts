import { Controller, Get } from '@nestjs/common';

@Controller('files')
export class FilesController {
  @Get()
  getHello(): string {
    return 'Hello';
  }
}
