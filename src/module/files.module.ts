import { Module } from '@nestjs/common';
import { FileRepository } from 'src/repository/file.repository';
import { FilesController } from 'src/controller/files.controller';
import { FilesService } from 'src/service/files.service';
import { FilesFormatter } from 'src/formatter/file.formatter';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService, FileRepository, FilesFormatter],
})
export class FilesModule {}
