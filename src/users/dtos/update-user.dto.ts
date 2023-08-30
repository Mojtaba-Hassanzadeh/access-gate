import { OmitType, PartialType } from '@nestjs/swagger';
import { CreateUserByCEOInput, CreateUserInput } from './create-user.dto';
import { CoreOutput } from 'src/dtos/output.dto';
import { User } from '../entities/user.entity';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {
  @IsOptional()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
    {
      message: 'رمز عبور معتبر نیست',
    },
  )
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
    {
      message: 'رمز عبور معتبر نیست',
    },
  )
  password?: string;
}

export class UodateUserByCEO extends PartialType(CreateUserByCEOInput) {
  userId: string;
}

export class UpdateUserOutput extends CoreOutput {
  user?: User;
}
