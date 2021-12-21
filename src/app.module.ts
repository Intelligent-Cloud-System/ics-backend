import {
  MiddlewareConsumer,
  Module,
  RequestMethod,
  Type,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserModule } from './module/user.module';
import { SystemModule } from './module/system.module';
import { FilesModule } from './module/files.module';
import configuration from './config/configuration';
import dbConfig from './config/db.config';

import { AuthenticationMiddleware } from './middleware/authentication.middleware';
import * as Controllers from './controller';
import { UserService } from './service/user.service';
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
    FilesModule,
  ],
  providers: [UserService, UserRepository],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    const controllers: Array<Type<any>> = Object.values(Controllers);

    // TODO: list endpoint which requires auth
    consumer
      .apply(AuthenticationMiddleware)
      .exclude(
        { path: '/system/healthy', method: RequestMethod.GET },
        { path: '/users/register', method: RequestMethod.POST },
        { path: '/files/download/(.*)', method: RequestMethod.GET }
      )
      .forRoutes(...controllers);
  }
}
