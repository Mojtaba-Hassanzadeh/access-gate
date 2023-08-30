import { Prop, Schema } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { ObjectId } from 'mongodb';
import { DefaultEntity } from 'src/entities/default.entity';
import { Document } from 'src/types/document.type';
import { User } from 'src/users/entities/user.entity';
import { SchemaFactory } from 'src/utils/schema-factory.util';

@Schema()
export class Verification extends DefaultEntity {
  @Prop()
  code: string;

  @Prop({ type: ObjectId, ref: User.name })
  user: ObjectId;

  @Prop({ required: true })
  clientId: string;

  @Prop({ type: Date, expires: '10m' })
  createdAt?: Date;

  validateCode: (code: string) => Promise<boolean>;
}

export type TVerification = Document<Verification>;
export const VerificationSchema = SchemaFactory(Verification);

VerificationSchema.pre('save', async function (next) {
  const verfication = this as TVerification;
  if (!verfication.code) {
    next();
    return;
  }
  if (!verfication.isModified('code')) return next();
  try {
    verfication.code = await bcrypt.hash(verfication.code, 10);
    return next();
  } catch (e) {
    return next(e as any);
  }
});

VerificationSchema.methods.validateCode = async function validateCode(
  data: string,
) {
  return bcrypt.compare(data, this.code);
};
