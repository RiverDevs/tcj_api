import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //await app.listen(process.env.PORT ?? 3000);

  app.setGlobalPrefix('api');
  
  app.enableCors({
    origin: 'http://127.0.0.1:5500', // ¡Importante! Reemplaza con el puerto de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Si usas cookies o sesiones
  });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Remueve propiedades que no estén definidas en el DTO
    forbidNonWhitelisted: true, // Lanza error si hay propiedades no definidas
    transform: true, // Transforma los tipos de los datos de entrada a los del DTO
  }));

  await app.listen(3000); // O el puerto donde se ejecuta tu backen

}
bootstrap();
