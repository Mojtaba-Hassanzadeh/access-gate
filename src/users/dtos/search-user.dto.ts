import { IsBoolean, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/enums/role.enum';
import { PaginationInput, PaginationOutput } from 'src/dtos/pagination.dto';
import { UserOutput } from './output-user.dto';

export class SearchUserInput extends PaginationInput {
  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  roles?: Role[];
}

export class SearchUserOutput extends PaginationOutput {
  results?: UserOutput[];
}
