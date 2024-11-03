import * as Mongoose from 'mongoose';
import { inject, injectable } from 'inversify';
import { setTimeout } from 'node:timers/promises';

import { Logger } from '../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';'../../libs/logger/index.js';
import { Component } from '../../types/index.js';
import { DatabaseClient } from './database-client.interface.js';

const RETRY_COUNT = 5;
const RETRY_TIMEOUT = 2000;

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

  public async connect(uri: string): Promise<void> {
    if (this.isConnected) {
      this.logger.warn(`Already connected to database; request to connect to ${uri}`);
      return new Promise((resolve, _reject) => resolve());
    }

    let retryNumber = 0;

    while (retryNumber < RETRY_COUNT) {
      try {
        this.logger.info(`Connecting to database ${uri}...`);

        this.mongoose = await Mongoose.connect(uri);

        this.isConnected = true;
        this.logger.info('Connected to database');
        return;
      } catch (error) {
        retryNumber += 1;
        this.logger.error('Failed to connect to dataabase. Try #${retryNumber} of ${RETRY_COUNT}', error as Error);
        await setTimeout(RETRY_TIMEOUT);
      }
    }

    throw new Error(`Unable to establish connection to database ${uri}`);
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
