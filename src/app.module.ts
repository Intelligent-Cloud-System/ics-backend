import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './controller/app.controller';
import { AppService } from './service/app.service';
import { DbController } from './controller/db.controller';
import { UsersModule } from './module/users.module';
import configuration from './config/configuration';
import dbConfig from './config/db.config';
import { DatabaseConfig } from './config/interfaces';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, dbConfig],
      envFilePath: ['.env.development'],
      isGlobal: true,
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get<DatabaseConfig>('db'),
        type: 'postgres',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    UsersModule,
  ],
  controllers: [AppController, DbController],
  providers: [AppService],
})
export class AppModule {}
