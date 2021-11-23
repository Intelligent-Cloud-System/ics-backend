import { Controller, Get, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FilesService } from './../service/files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('files')
export class FilesController {

  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  getHello(@Param('id') id: string): string {
    return 'Hello' + id;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
  }
}
