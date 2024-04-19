import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Colocar un prefijo al url de manera global.
  app.setGlobalPrefix('api/v2');

  // Configurar validador (Pipes) a nivel global.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Solo deja la data del cuerpot esperado (DTO)
      forbidNonWhitelisted: true, // Valida que el cuerpo solo contenga la data solicitada (DTO)
    }),
  );
  
  await app.listen(3000);
}
bootstrap();
