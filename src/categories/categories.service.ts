// src/categories/categories.service.ts
import { Injectable } from '@nestjs/common';
import { CategoryEnum } from './enums/category.enum';

@Injectable()
export class CategoriesService {
  // Devuelve la lista de categorías disponibles
  getAllCategories(): string[] {
    return Object.values(CategoryEnum);
  }

  // Verifica si una categoría es válida (opcional, por si lo necesitas)
  isValidCategory(category: string): boolean {
    return Object.values(CategoryEnum).includes(category as CategoryEnum);
  }
}

