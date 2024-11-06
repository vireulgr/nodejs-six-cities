import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';

import { DefaultUserService } from './default-user-service.js';
import { UserService } from './user-service.interface.js';
import { UserEntity, UserModel } from './user.entity.js';

import { Component } from '../../types/index.js';

export function createUserContainer() {
  const container = new Container();

  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);

  return container;
}
