import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Param,
  Delete,
  Patch,
} from '@nestjs/common';
// import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';
import { CreateUserInput } from './dtos/create-user.dto';
import { SearchUserInput } from './dtos/search-user.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  create(@Body() input: CreateUserInput) {
    return this.userService.createUser(input);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() input: UpdateUserInput) {
    return this.userService.updateUser(id, input);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @Get()
  search(@Query() query: SearchUserInput) {
    return `TODO`;
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.userService.findById(id);
  }
}
