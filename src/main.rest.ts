import 'reflect-metadata';
import { Container } from 'inversify';
import { Component } from './shared/types/component.enum.js';

import { RestApplication } from './rest/rest.application.js';
import { createRestApplicationContainer } from './rest/rest.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createCoordinatesContainer } from './shared/modules/offerType/coordinates.container.js';
import { createOfferContainer } from './shared/modules/offer/offer.container.js';


async function bootstrap() {
  const container = Container.merge(
    createRestApplicationContainer(),
    createUserContainer(),
    createCoordinatesContainer(),
    createOfferContainer(),
  );

  const application = container.get<RestApplication>(Component.RestApplication);
  await application.init();
}


bootstrap();
