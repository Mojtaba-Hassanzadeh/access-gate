import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateUserInput } from './dtos/create-user.dto';
import { TUser, User } from './entities/user.entity';
import { UsersRepository } from './users.repository';
import { isNullOrUndefined } from 'src/utils/is-null-or-undefined.util';
import { CoreOutput } from 'src/dtos/output.dto';
import { UpdateUserInput } from './dtos/update-user.dto';
import { FindOneUserByEmailOrPhoneInput } from './dtos/find-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private connection: Connection,
    private readonly usersRepository: UsersRepository,
  ) {}

  // async search(): Promise<User[]> {
  //   try {
  //     const users = await this.usersRepository.();
  //     return users || [];
  //   } catch (error) {
  //     throw new InternalServerErrorException(error);
  //   }
  // }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOneById(id);
      if (!user) throw new NotFoundException();
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findByEmailOrPhone(
    input: FindOneUserByEmailOrPhoneInput,
  ): Promise<User | null> {
    try {
      return await this.usersRepository.findOneByEmailOrPhone(input);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async createUser(input: CreateUserInput): Promise<CoreOutput> {
    try {
      const { email, phone } = input;
      if (isNullOrUndefined(email) && isNullOrUndefined(phone))
        throw new BadRequestException(
          'لطفا شماره همراه و یا ایمیل خود را وارد کنید',
        );

      await this.usersRepository.create(input);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<CoreOutput> {
    try {
      await this.usersRepository.update(id, input);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteUser(id: string): Promise<CoreOutput> {
    try {
      await this.usersRepository.delete(id);
      return {
        success: true,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
