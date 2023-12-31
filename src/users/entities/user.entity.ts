import { Prop, Schema } from '@nestjs/mongoose';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { CallbackError } from 'mongoose';
import { DefaultEntity } from 'src/entities/default.entity';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';
import { Document } from 'src/types/document.type';
import { SchemaFactory } from 'src/utils/schema-factory.util';

@Schema()
export class User extends DefaultEntity {
  @Prop({ type: String })
  @IsString()
  @IsOptional()
  @IsString()
  @Length(3, 30, {
    message: 'نام کاربری باید بین 3 تا 30 کاراکتر باشد',
  })
  username?: string;

  @Prop({ type: String, select: false })
  @IsString()
  @IsOptional()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})/,
    {
      message: 'رمز عبور را درست انخاب کنید',
    },
  )
  password?: string;

  @Prop({ type: String, unique: true })
  @IsString()
  @IsOptional()
  @ValidateIf((u: User) => !!(!u.phone || u.email))
  @IsEmail({}, { message: 'ایمیل وارد شده صحیح نیست' })
  email?: string;

  @Prop({ type: String, unique: true })
  @IsString()
  @IsOptional()
  @ValidateIf((o: User) => !!(!o.email || o.phone))
  @Matches(/^09(1[0-9]|3[1-9])-?[0-9]{3}-?[0-9]{4}$/, {
    message: 'شماره موبایل وارد شده صحیح نیست ',
  })
  phone?: string;

  @Prop({
    type: String,
    enum: [...Object.values(Role)],
    default: Role.USER,
  })
  @IsEnum(Role)
  role?: Role;

  @Prop({
    type: Boolean,
    default: false,
  })
  isVerified: boolean;

  validatePassword?: (password: string) => Promise<boolean>;
}

export type TUser = Document<User>;
export const UserSchema = SchemaFactory(User);

UserSchema.index({ username: 'text' });
UserSchema.index({ username: 1 });

UserSchema.pre('save', async function (next) {
  const user = this as TUser;
  if (!user.password) {
    next();
    return;
  }
  if (!user.isModified('password')) return next();
  try {
    user.password = await bcrypt.hash(user.password, 10);
    return next();
  } catch (e) {
    return next(e as CallbackError);
  }
});
UserSchema.methods.validatePassword = async function validatePassword(
  data: string,
) {
  return bcrypt.compare(data, this.password);
};
