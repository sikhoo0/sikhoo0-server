import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigType } from '@nestjs/config';
import appConfig from '../src/config/app.config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  const port: number = config.port;
  const host: string = config.host;
  await app.listen(port, host, async () => Logger.log(`Application is running on: ${await app.getUrl()}`));
}
void bootstrap();
