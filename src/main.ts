import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { SwaggerConfig } from './config/interfaces';
import { ErrorInterceptor } from './interceptor/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const swagger: SwaggerConfig = configService.get('swagger') as SwaggerConfig;
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'authorization'
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalInterceptors(new ErrorInterceptor());

  const port = configService.get('port');

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
