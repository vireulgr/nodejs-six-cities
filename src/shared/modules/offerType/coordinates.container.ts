import { Container } from 'inversify';
import { DefaultCoordinatesService } from './default-coordinates-service.js';
import { Component } from '../../types/index.js';
import { CoordinatesService } from './coordinates-service.interface.js';
import { types } from '@typegoose/typegoose';
import { CoordinatesEntity, CoordinatesModel } from './coordinates.entity.js';

export function createCoordinatesContainer() {
  const container = new Container();
  container.bind<CoordinatesService>(Component.CoordinatesService).to(DefaultCoordinatesService).inSingletonScope();
  container.bind<types.ModelType<CoordinatesEntity>>(Component.CoordinatesModel).toConstantValue(CoordinatesModel);

  return container;
}
