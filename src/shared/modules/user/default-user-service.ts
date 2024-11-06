import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/logger.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    this.logger.info(`Create user ${dto.firstName}`);
    const user = new UserEntity(dto);
    user.setPassword(dto.password, salt);

    return UserModel.create(user);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    this.logger.info(`Find user ${email}`);
    return this.userModel.findOne({email});
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existedUser = await this.findByEmail(dto.email);

    if (existedUser) {
      return existedUser;
    }

    return this.create(dto, salt);
  }
}
