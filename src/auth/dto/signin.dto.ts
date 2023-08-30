import { PickType } from '@nestjs/swagger';
import { CoreOutput } from 'src/dtos/output.dto';
import { CreateUserInput } from 'src/users/dtos/create-user.dto';

export class SigninInput extends PickType(CreateUserInput, [
  'email',
  'password',
  'phone',
]) {}

export class SigninOutput extends CoreOutput {
  token?: string;
}

export class IsValidAndVerifiedAccountInput extends PickType(CreateUserInput, [
  'email',
  'phone',
]) {}

export class IsValidAndVerifiedAccountOutput extends CoreOutput {
  isVerified: boolean;
  hasPassword: boolean;
}
