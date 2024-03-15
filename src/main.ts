import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './response/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.enableCors({});
  const config: ConfigService = app.get(ConfigService);
  const port: number = config.get<number>('PORT');
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Category Manager')
    .setDescription('The Category Manager API Documentation')
    .setVersion('1.0')
    .addTag('category')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {
    Logger.verbose('[WEB]', config.get<string>('BASE_URL'));
  });
}
bootstrap();
