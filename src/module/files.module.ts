import { Module } from '@nestjs/common';
import { FileRepository } from 'src/repository/file.repository';
import { UserRepository } from 'src/repository/user.repository';
import { FilesController } from './../controller/files.controller';
import { FilesService } from './../service/files.service';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService, UserRepository, FileRepository],
})
export class FilesModule {}
