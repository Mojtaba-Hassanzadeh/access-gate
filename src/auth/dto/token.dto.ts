import { IsNotEmpty, IsString } from 'class-validator';

export class TokenInput {
  @IsString()
  @IsNotEmpty()
  token: string;
}
