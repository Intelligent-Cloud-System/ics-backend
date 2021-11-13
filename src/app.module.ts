import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { DbController } from './controller/db.controller';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development'],
      isGlobal: true,
    }),
  ],
  controllers: [AppController, DbController],
  providers: [AppService],
})
export class AppModule {}
