import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';

import { Logger } from '../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { DatabaseClient } from './database-client.interface.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {

  private mongoose: typeof Mongoose;
  private isConnected: boolean;

  constructor(
    @inject(Component.Logger) private logger: Logger
  ) {
    this.isConnected = false;
  }

  public isConnectedToDatabase(): boolean {
    return this.isConnected;
  }

  public async connect(url: string): Promise<void> {
    if (this.isConnected) {
      this.logger.warn(`Already connected to database; request to connect to ${url}`);
      return new Promise((resolve, _reject) => resolve());
    }
    this.logger.info(`Connecting to database ${url}...`);

    this.mongoose = await Mongoose.connect(url);

    this.isConnected = true;
    this.logger.info('Connected to database');
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      this.logger.warn('Not connected to database');
      return new Promise((resolve, _reject) => resolve());
    }

    await this.mongoose.disconnect?.();

    this.isConnected = false;
    this.logger.info('Disconnected from database');
  }
}
