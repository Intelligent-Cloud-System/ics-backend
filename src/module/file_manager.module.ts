import { Module } from '@nestjs/common';

import { FileManagerController } from 'src/controller';
import { FileManagerService, FileManagerFormatter } from 'src/service/file_manager';
import { StorageService } from 'src/service/storage';

@Module({
  imports: [],
  controllers: [FileManagerController],
  providers: [FileManagerService, FileManagerFormatter, StorageService],
})
export class FileManagerModule {}
