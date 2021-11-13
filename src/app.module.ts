import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { SystemController } from './controller/system.comtroller';
import { AppService } from './service/app.service';

@Module({
  imports: [],
  controllers: [AppController, SystemController],
  providers: [AppService],
})
export class AppModule {}
