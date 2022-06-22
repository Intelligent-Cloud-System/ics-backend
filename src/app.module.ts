import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule, SystemModule, FileManagerModule, WebsocketModule } from './module';
import configuration from './config/configuration';
import dbConfig from './config/db.config';
import { DatabaseConfig } from './config/interfaces';

import { UserService } from './service/user/user.service';
import { UserRepository } from './repository/user.repository';
import { ImageGen } from './service/icon';
import { StorageService } from './service/storage';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(dbConfig() as DatabaseConfig),
    UserModule,
    SystemModule,
    FileManagerModule,
    WebsocketModule,
  ],
  providers: [UserService, UserRepository, ImageGen, StorageService],
})
export class AppModule {}
