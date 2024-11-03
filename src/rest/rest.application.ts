import { injectable, inject } from 'inversify';

import { Logger } from '../shared/libs/logger/index.js';
import { Config } from '../shared/libs/config/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';

import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { getMongoURI } from '../shared/helpers/getMongoURI.js';

@injectable()
export class RestApplication {

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient) private readonly databaseClient: DatabaseClient,
  ) {}

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Port is ${this.config.get('PORT')}`);

    this.logger.info('init database connection...');
    await this.initDB();
    this.logger.info('Init database connection completed');
  }

  private async initDB() {
    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );

    this.databaseClient.connect(mongoUri);
  }
}

