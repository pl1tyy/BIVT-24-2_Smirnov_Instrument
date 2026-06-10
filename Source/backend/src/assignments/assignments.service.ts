import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { Assignment } from './assignment.model';

@Injectable()
export class AssignmentsService {
  private assignments: Assignment[] = [];
  private nextId = 1;

  findAll(): Assignment[] {
    return this.assignments;
  }

  findActive(): Assignment[] {
    return this.assignments.filter(a => !a.returned_at);
  }

  create(dto: CreateAssignmentDto, toolsService: any, usersService: any): Assignment {
    // Проверка доступности инструмента
    const tool = toolsService.findOne(dto.tool_id);
    if (tool.status !== 'available') {
      throw new BadRequestException('Инструмент не доступен для выдачи');
    }

    const newAssignment: Assignment = {
      id: this.nextId++,
      ...dto,
      issued_at: new Date().toISOString(),
    };
    this.assignments.push(newAssignment);

    // Меняем статус инструмента
    toolsService.update(dto.tool_id, { status: 'issued' });

    return newAssignment;
  }

  returnTool(assignmentId: number, toolsService: any): Assignment {
    const assignment = this.assignments.find(a => a.id === assignmentId && !a.returned_at);
    if (!assignment) {
      throw new NotFoundException('Выдача не найдена или инструмент уже возвращен');
    }

    assignment.returned_at = new Date().toISOString();

    // Возвращаем статус инструмента
    toolsService.update(assignment.tool_id, { status: 'available' });

    return assignment;
  }
}