import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateToolDto } from './dto/create-tool.dto';
import { Tool } from './tool.model';

@Injectable()
export class ToolsService {
  private tools: Tool[] = [
    { id: 1, inventory_number: 'INV-001', name: 'Молоток слесарный', category_id: 1, status: 'available', purchase_date: '2023-01-15', condition_score: 5 },
    { id: 2, inventory_number: 'INV-002', name: 'Дрель электрическая', category_id: 2, status: 'available', purchase_date: '2022-05-20', condition_score: 4 },
    { id: 3, inventory_number: 'INV-003', name: 'Штангенциркуль', category_id: 3, status: 'available', purchase_date: '2023-03-10', condition_score: 5 },
  ];
  private nextId = 4;

  findAll(): Tool[] {
    return this.tools;
  }

  findOne(id: number): Tool {
    const tool = this.tools.find((t) => t.id === id);
    if (!tool) {
      throw new NotFoundException(`Инструмент с ID ${id} не найден`);
    }
    return tool;
  }

  create(dto: CreateToolDto): Tool {
    const newTool: Tool = {
      id: this.nextId++,
      ...dto,
      status: dto.status || 'available',
    };
    this.tools.push(newTool);
    return newTool;
  }

  update(id: number, dto: Partial<CreateToolDto>): Tool {
    const tool = this.findOne(id);
    const index = this.tools.findIndex((t) => t.id === id);
    this.tools[index] = { ...tool, ...dto };
    return this.tools[index];
  }

  delete(id: number): void {
    const index = this.tools.findIndex((t) => t.id === id);
    if (index === -1) {
      throw new NotFoundException(`Инструмент с ID ${id} не найден`);
    }
    this.tools.splice(index, 1);
  }
}