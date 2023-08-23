import { IsOptional, IsString } from 'class-validator';
import { PaginationInput } from 'src/dtos/pagination.dto';

export class SearchUserInput extends PaginationInput {
  @IsOptional()
  @IsString()
  username?: string;
}
