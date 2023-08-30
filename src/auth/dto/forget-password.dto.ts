import { PickType } from '@nestjs/swagger';
import { User } from 'src/users/entities/user.entity';

export class ForgetPasswordInput extends PickType(User, ['email', 'phone']) {}
