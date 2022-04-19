import { NestFactory } from '@nestjs/core';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import fmp from 'fastify-multipart';

import { AppModule } from './app.module';
import { SwaggerConfig } from './config/interfaces';
import { ErrorInterceptor } from './interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ maxParamLength: 1000 })
  );
  const configService = app.get(ConfigService);
  const logger = new Logger(bootstrap.name);

  const cors: CorsOptions = configService.get('swagger') as CorsOptions;

  app.enableCors(cors);
  app.register(fmp);

  const swagger: SwaggerConfig = configService.get('swagger') as SwaggerConfig;
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'authorization'
    )
    .build();

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ErrorInterceptor());

  const port = configService.get('port');

  await app.listen(port);

  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
