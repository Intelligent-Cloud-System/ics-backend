import { Module } from '@nestjs/common';

import { FileManagerController } from 'src/controller';
import { FileManagerService, FileManagerFormatter } from 'src/service/file_manager';
import { StorageService } from 'src/service/storage';
import { ImageGen } from 'src/service/icon/icon_generator';

@Module({
  imports: [],
  controllers: [FileManagerController],
  providers: [FileManagerService, FileManagerFormatter, StorageService, ImageGen],
})
export class FileManagerModule {}
