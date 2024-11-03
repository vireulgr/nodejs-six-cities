import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { User } from '../../types/index.js';

// intentionally merge interface and class
export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
    timestamps: true
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({required: true, unique: true})
  public email: string;

  @prop({required: true})
  public firstName: string;

  @prop({required: true})
  public lastName: string;

  @prop({required: false, default: ''})
  public avatarPath: string;

  @prop({required: true, default: ''})
  private password?: string;

  constructor(user: User) {
    super();

    this.email = user.email;
    this.avatarPath = user.avatarPath;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }
}

export const UserModel = getModelForClass(UserEntity);
