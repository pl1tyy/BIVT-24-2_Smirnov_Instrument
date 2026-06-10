import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Category } from './categories.model';

@Injectable()
export class CategoriesService {
  private categories: Category[] = [
    { id: 1, name: 'Ручной инструмент', description: 'Молотки, отвертки, ключи' },
    { id: 2, name: 'Электроинструмент', description: 'Дрели, шуруповерты, болгарки' },
    { id: 3, name: 'Измерительный инструмент', description: 'Линейки, штангенциркули' },
  ];
  private nextId = 4;

  findAll(): Category[] {
    return this.categories;
  }

  create(dto: CreateCategoryDto): Category {
    const newCategory: Category = {
      id: this.nextId++,
      ...dto,
    };
    this.categories.push(newCategory);
    return newCategory;
  }
}