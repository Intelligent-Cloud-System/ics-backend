import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { DbController } from './controller/db.controller';
import { config } from './orm.config';
import { UsersModule } from './module/users.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      envFilePath: ['.env.development'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRoot(config),
    UsersModule,
  ],
  controllers: [AppController, DbController],
  providers: [AppService],
})
export class AppModule {}
