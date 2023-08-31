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
import { CreateUserByCEOInput, CreateUserInput } from './dtos/create-user.dto';
import { SearchUserInput } from './dtos/search-user.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { CoreOutput } from 'src/dtos/output.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { BossGuard } from 'src/auth/guards/boss.guard';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Post()
  // @BossGuard<MethodDecorator>(Role.CEO)
  @Roles(Role.CEO)
  async create(
    @Body() input: CreateUserByCEOInput,
    @GetUser() user: User,
  ): Promise<CoreOutput> {
    console.log('user :>> ', user);
    return this.userService.createUserByCEO(input, user);
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
