import { IsString } from 'class-validator';

export class VerifyAccountInput {
  @IsString()
  code: string;
}
