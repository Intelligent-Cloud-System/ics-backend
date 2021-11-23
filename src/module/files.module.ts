import { Module } from '@nestjs/common';
import { FilesController } from './../controller/files.controller';
import { FilesService } from './../service/files.service';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
