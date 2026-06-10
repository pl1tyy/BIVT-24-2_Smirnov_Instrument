import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ToolsModule } from './tools/tools.module';
import { CategoriesModule } from './categories/categories.module';
import { AssignmentsModule } from './assignments/assignments.module';

@Module({
  imports: [
    UsersModule,
    ToolsModule,
    CategoriesModule,
    AssignmentsModule,
  ],
})
export class AppModule {}