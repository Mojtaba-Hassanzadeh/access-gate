import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dtos/update-user.dto';
import { CreateUserInput } from './dtos/create-user.dto';
import { SearchUserInput } from './dtos/search-user.dto';
import { SearchData } from 'src/interfaces/search-data.interface';
import { isNullOrUndefined } from 'src/utils/is-null-or-undefined.util';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async search({
    text,
    username,
    email,
    phone,
    roles,
    isVerified,
    page,
    count,
  }: SearchUserInput): Promise<SearchData<User>> {
    const isVerifiedFilter: PipelineStage[] = !isNullOrUndefined(isVerified)
      ? [
          {
            $match: { isVerified },
          },
        ]
      : [];

    const pipeline: PipelineStage[] = [
      {
        $match: {
          ...(text && {
            $or: [{ $text: { $search: text } }],
          }),
          ...(username && { username }),
          ...(email && { email }),
          ...(phone && { phone }),
          ...(roles && { role: { $in: roles } }),
        },
      },
      ...isVerifiedFilter,
      {
        $sort: {
          _id: -1,
        },
      },
      {
        $facet: {
          results: [{ $skip: (page - 1) * count }, { $limit: count }],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
    ];
    const [searchData = {}] = await this.userModel.aggregate(pipeline);

    return {
      results: searchData.results,
      totalCount: searchData.totalCount?.[0]?.count,
    };
  }

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
