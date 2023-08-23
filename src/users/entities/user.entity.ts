import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  username?: string;

  @Prop()
  password?: string;

  @Prop()
  email?: string;

  @Prop()
  phone?: string;

  //   @Prop()
  //   roles?: Role[];

  //   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Image' })
  //   avatar?: Image;
}

export const UserSchema = SchemaFactory.createForClass(User);
