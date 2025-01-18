import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as path from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.useStaticAssets(path.join(__dirname, '../uploads'));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  // Set up Swagger options
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('API documentation for your project')
    .setVersion('1.0')
    .addTag('subjects') // Optional: you can add tags to categorize your endpoints
    .build();
  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Serve Swagger documentation at /api-docs
  SwaggerModule.setup('api', app, document);
  await app.listen(5000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
