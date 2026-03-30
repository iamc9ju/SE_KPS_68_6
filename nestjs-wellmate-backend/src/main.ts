import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { MyLoggerService } from './my-logger/my-logger.service';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { GlobalExceptionsFilter } from './common/filters/all-exceptions.filter';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    rawBody: true,
  });
  // Avoid 304 cached responses for dynamic JSON endpoints
  const httpAdapter = app.getHttpAdapter();
  const instance = httpAdapter.getInstance?.();
  if (instance?.set) {
    instance.set('etag', false);
  }
  app.useLogger(app.get(MyLoggerService));

  app.use(helmet());

  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));

  const configService = app.get(ConfigService);
  const frontendUrl =
    configService.get<string>('FRONTEND_URL') ||
    'https://nextjs-wellmate-frontend-git-main-ittipol-botmoons-projects.vercel.app/';

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  });
  app.setGlobalPrefix('api');

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('WellMate API')
    .setDescription('The WellMate API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  const httpAdapterHost = app.get(HttpAdapterHost);
  const myLogger = app.get(MyLoggerService);

  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapterHost, myLogger));

  // Graceful shutdown — release port before process exits (fixes EADDRINUSE on hot-reload)
  app.enableShutdownHooks();

  const server = await app.listen(process.env.PORT ?? 4000);

  // Ensure the HTTP server closes quickly on SIGTERM/SIGINT (sent by nest --watch)
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}, shutting down gracefully...`);
    server.close(() => {
      process.exit(0);
    });
    // Force exit if server doesn't close in 3 seconds
    setTimeout(() => process.exit(1), 3000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
void bootstrap();
