import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS (ajusta dominios que necesitas: localhost, vercel, onrender, etc.)
  app.enableCors({
    origin: true,
    credentials: false,
  });

  // ValidationPipe (ya que instalaste class-validator y class-transformer)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Importante para Docker/Render
  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap();
