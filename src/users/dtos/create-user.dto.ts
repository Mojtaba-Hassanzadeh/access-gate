import { OmitType, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class CreateUserInput extends PickType(User, [
  'email',
  'password',
  'username',
  'phone',
]) {}

export class CreateUserByCEOInput extends OmitType(User, [
  '_id',
  'createdAt',
  'updatedAt',
]) {}
