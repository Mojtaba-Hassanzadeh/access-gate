import { IsString } from 'class-validator';

import { PickType } from '@nestjs/swagger';
import { CreateUserInput } from 'src/users/dtos/create-user.dto';

export class ResetPasswordRequestInput extends PickType(CreateUserInput, [
  'email',
]) {}

export class ResetPasswordInput extends PickType(CreateUserInput, [
  'email',
  'password',
]) {
  @IsString()
  token: string;
}
