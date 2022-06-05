import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './module/user.module';
import { SystemModule } from './module/system.module';
import { FileManagerModule } from './module/file_manager.module';
import configuration from './config/configuration';
import dbConfig from './config/db.config';

import { UserService } from './service/user/user.service';
import { UserRepository } from './repository/user.repository';
import { DatabaseConfig } from './config/interfaces';

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
  ],
  providers: [UserService, UserRepository],
})
export class AppModule {}
