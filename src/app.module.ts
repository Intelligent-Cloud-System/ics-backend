import { Module } from '@nestjs/common';
import { AppController } from './controller/app.controller';
import { SystemController } from './controller/system.comtroller';
import { AppService } from './service/app.service';
import { CatsController } from './controller/cats.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController, SystemController],
  providers: [AppService],
})
export class AppModule {}
