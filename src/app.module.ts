import { MiddlewareConsumer, Module, Type } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './controller/app.controller';
import { UserModule } from './module/user.module';
import { SystemModule } from './module/system.module';
import { FilesModule } from './module/files.module';
import { AppService } from './service/app.service';
import { DatabaseConfig } from './config/interfaces';
import configuration from './config/configuration';
import dbConfig from './config/db.config';

import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import * as Controllers from './controller';
import { EntityManager } from 'typeorm';
import { User } from './model/user';
import { UserService } from './service/user.service';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration, dbConfig],
      envFilePath: ['.env'],
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
    EntityManager,
    UserModule,
    SystemModule,
    FilesModule,
  ],
  controllers: [AppController],
  providers: [AppService, UserService, UserRepository, User, String, Number],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const controllers: Array<Type<any>> = Object.values(Controllers);

    // TODO: list endpoint which requires auth
    consumer.apply(AuthenticationMiddleware).forRoutes(...controllers);
  }
}
