import { Module } from '@nestjs/common';
import { FileRepository } from 'src/repository/file.repository';
import { FilesController } from 'src/controller/files.controller';
import { FileService } from 'src/service/file.service';
import { FileFormatter } from 'src/formatter/file.formatter';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FileService, FileRepository, FileFormatter],
})
export class FilesModule {}
