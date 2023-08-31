import { PickType } from '@nestjs/swagger';
import { CreateUserInput } from './create-user.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { TUser, User } from '../entities/user.entity';
import { ProjectionType } from 'mongoose';

export class FindValidUserInput extends PickType(CreateUserInput, [
  'email',
  'password',
]) {}

export class FindUserInput {
  @IsString({ message: 'id must be string' })
  @IsNotEmpty({ message: 'id can not be empty' })
  id: string;
}

export class FindOneUserByEmailOrPhoneInput extends PickType(User, [
  'email',
  'phone',
]) {
  options?: ProjectionType<TUser>;
}
