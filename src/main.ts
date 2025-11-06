import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger } from '@nestjs/common';
import { LoggingInterceptor } from './common/interceptors/loggers.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import * as express from 'express';
async function bootstrap() {
  const port = process.env.PORT ?? 5000;

  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      prefix: 'MyProject',
    }),
  });
  app.use('/uploads', express.static('./src/uploads'));
  app.useGlobalInterceptors(new LoggingInterceptor(), new ResponseInterceptor())
  //app.use(Logger);
  await app.listen(port, () => {
    console.log(`Server is Running on http://localhost ${port}`);
  });
}
bootstrap();
