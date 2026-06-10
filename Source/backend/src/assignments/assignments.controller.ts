import { Controller, Get, Post, Body, Param, ParseIntPipe } from '@nestjs/common';
import { AssignmentsService } from './assignments.service';
import { CreateAssignmentDto } from './dto/create-assignment.dto';
import { ToolsService } from '../tools/tools.service';

@Controller('assignments')
export class AssignmentsController {
  constructor(
    private readonly assignmentsService: AssignmentsService,
    private readonly toolsService: ToolsService, // ← Просто тип, без @Inject
  ) {}

  @Get()
  findAll() {
    return this.assignmentsService.findAll();
  }

  @Get('active')
  findActive() {
    return this.assignmentsService.findActive();
  }

  @Post()
  create(@Body() createAssignmentDto: CreateAssignmentDto) {
    return this.assignmentsService.create(createAssignmentDto, this.toolsService, null);
  }

  @Post(':id/return')
  returnTool(@Param('id', ParseIntPipe) id: number) {
    return this.assignmentsService.returnTool(id, this.toolsService);
  }
}