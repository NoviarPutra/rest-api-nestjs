import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({
      logger: {
        transport: {
          target: 'pino-pretty',
          options: {
            translateTime: 'SYS: ddd, dd-mmm-yyyy: HH:MM:ss o',
            ignore: 'pid,hostname',
            colorize: true,
          },
        },
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Nest API Documentation')
    .setDescription('Nest API Documentation')
    .setVersion('1.0')
    .addTag('Nest API Documentation')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
