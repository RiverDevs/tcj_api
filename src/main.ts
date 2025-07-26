import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'https://tu-dominio-hostinger.com'], // ¡Importante! Aquí debes reemplazar 'http://127.0.0.1:5500' con el *dominio real* de tu frontend en Hostinger. Puedes poner múltiples orígenes en un array.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // === CAMBIO CRÍTICO AQUÍ ===
  const port = process.env.PORT || 3000; // Render usará process.env.PORT (que es 10000)
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`); // Esto te ayudará a ver la URL en los logs de Render
}
bootstrap();
