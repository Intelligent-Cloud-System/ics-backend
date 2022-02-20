import { Module } from '@nestjs/common';
import { FileRepository } from 'src/repository/file.repository';
import { FileController } from 'src/controller/file.controller';
import { FileService } from 'src/service/file/file.service';
import { FileFormatter } from 'src/formatter/file.formatter';

@Module({
  imports: [],
  controllers: [FileController],
  providers: [FileService, FileRepository, FileFormatter],
})
export class FilesModule {}
