import { ObjectId } from 'mongodb';

export class DefaultEntity {
  _id: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}
