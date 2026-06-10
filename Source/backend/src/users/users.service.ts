import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './user.model';

@Injectable()
export class UsersService {
  // Данные хранятся в памяти (требование задания)
  private users: User[] = [];
  private nextId = 1;

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User {
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException(`Пользователь с ID ${id} не найден`);
    }
    return user;
  }

  create(dto: CreateUserDto): User {
    const newUser: User = {
      id: this.nextId++,
      name: dto.name,
      email: dto.email,
      age: dto.age,
    };
    this.users.push(newUser);
    return newUser;
  }
}