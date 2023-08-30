import { PickType } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class SendVerificationCodeInput extends PickType(User, [
  'email',
  'phone',
] as const) {}
