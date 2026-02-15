import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.use('/presents/webhook', bodyParser.raw({ type: 'application/json' }));
  app.use('/presents/webhook/v2', bodyParser.raw({ type: 'application/json' }));
  app.use('/presents/webhook/v3', bodyParser.raw({ type: 'application/json' }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
