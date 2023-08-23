import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional, IsString } from 'class-validator';
import { HydratedDocument } from 'mongoose';
import { DefaultEntity } from 'src/entities/default.entity';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends DefaultEntity {
  @Prop()
  @IsString()
  @IsOptional()
  username?: string;

  @Prop()
  @IsString()
  @IsOptional()
  password?: string;

  @Prop()
  @IsString()
  @IsOptional()
  email?: string;

  @Prop()
  @IsString()
  @IsOptional()
  phone?: string;

  //   @Prop()
  //   roles?: Role[];

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Image' })
  //   avatar?: Image;
}

export const UserSchema = SchemaFactory.createForClass(User);
