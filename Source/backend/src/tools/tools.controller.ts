import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { ToolsService } from './tools.service';
import { CreateToolDto } from './dto/create-tool.dto';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  findAll() {
    return this.toolsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.toolsService.findOne(id);
  }

  @Post()
  create(@Body() createToolDto: CreateToolDto) {
    return this.toolsService.create(createToolDto);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateToolDto: Partial<CreateToolDto>) {
    return this.toolsService.update(id, updateToolDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    this.toolsService.delete(id);
    return { message: 'Инструмент удален' };
  }
}