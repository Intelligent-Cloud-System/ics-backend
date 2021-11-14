import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { SwaggerConfig } from './config/interfaces';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  
  const swagger: SwaggerConfig = configService.get('swagger');
  const config = new DocumentBuilder()
    .setTitle(swagger.title)
    .setDescription(swagger.description)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  const port = configService.get('port');

  await app.listen(port);

  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
