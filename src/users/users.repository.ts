import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dtos/update-user.dto';
import { CreateUserInput } from './dtos/create-user.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  //   async search(): Promise<User[]> {
  //     const users = await this.userModel.find();
  //     return users || [];
  //   }

  async findOneById(id: string): Promise<User> {
    return this.userModel.findById(id).exec();
  }

  async create(data: CreateUserInput): Promise<User> {
    const createdEntity = new this.userModel(data);
    return createdEntity.save();
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(id, { ...input }, { new: true })
      .exec();
    return user;
  }

  async delete(id: string): Promise<User> {
    const user = await this.userModel.findByIdAndDelete(id).exec();
    return user;
  }
}
