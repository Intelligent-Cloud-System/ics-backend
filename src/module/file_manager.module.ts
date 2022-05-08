import { Module } from '@nestjs/common';
import { FileManagerController } from 'src/controller/file_manager.controller';
import { FileManagerService } from '../service/file_manager/file_manager.service';
import { FileManagerFormatter } from '../service/file_manager/file_manager.formatter';
import { StorageService } from '../service/storage/storage.service';

@Module({
  imports: [],
  controllers: [FileManagerController],
  providers: [FileManagerService, FileManagerFormatter, StorageService],
})
export class FileManagerModule {}
