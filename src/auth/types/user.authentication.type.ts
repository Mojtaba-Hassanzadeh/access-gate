import { User } from 'src/users/entities/user.entity';

export interface UserAuthenticationType {
  user: User;
  clientId: string;
}
