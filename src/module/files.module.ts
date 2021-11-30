import { Module } from '@nestjs/common';
import { UserRepository } from 'src/repository/user.repository';
import { UserService } from 'src/service/user.service';
import { FilesController } from './../controller/files.controller';
import { FilesService } from './../service/files.service';

@Module({
  imports: [],
  controllers: [FilesController],
  providers: [FilesService, UserService, UserRepository],
})
export class FilesModule {}
