import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserOutput extends OmitType(User, ['password']) {}
