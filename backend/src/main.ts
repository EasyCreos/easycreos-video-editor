import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import { ConfigService } from './config/config.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  app.enableCors({
    origin: [configService.get('FRONTEND_URL')],
    credentials: true,
  });

  app.use(cookieParser());

  app.use(
    csurf({
      cookie: {
        key: '_csrf',
        httpOnly: true,
        secure: configService.get('NODE_ENV') === 'production',
        sameSite: 'lax',
      },
    }),
  );

  await app.listen(configService.getNumber('PORT', 5000));
}
bootstrap();
