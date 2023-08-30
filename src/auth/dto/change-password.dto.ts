import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/users/entities/user.entity';

export class ChangePasswordInput extends PickType(User, ['password']) {
  @IsString()
  @IsNotEmpty()
  code: string;
}
