import { PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class FindValidUserInput extends PickType(CreateUserInput, [
  'email',
  'password',
]) {}

export class FindUserInput {
  @IsString({ message: 'id must be string' })
  @IsNotEmpty({ message: 'id can not be empty' })
  id: string;
}
