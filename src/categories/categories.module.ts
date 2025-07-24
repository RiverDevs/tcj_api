// src/categories/categories.module.ts
import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
  providers: [CategoriesService],
  controllers: [CategoriesController], // si tienes uno
  exports: [CategoriesService], // si lo usas en otros módulos
})
export class CategoriesModule {}

