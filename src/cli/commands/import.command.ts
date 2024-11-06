import { Offer } from '../../shared/types/index.js';
import { getErrorMessage, getMongoURI } from '../../shared/helpers/index.js';

import { Command } from './command.interface.js';

import { TSVFileReader } from '../../shared/libs/file-reader/index.js';
import { Logger, ConsoleLogger } from '../../shared/libs/logger/index.js';
import { DatabaseClient, MongoDatabaseClient } from '../../shared/libs/database-client/index.js';
import { UserService, DefaultUserService, UserModel } from '../../shared/modules/user/index.js';
import { DefaultOfferService } from '../../shared/modules/offer/default-offer-service.js';
import { OfferModel } from '../../shared/modules/offer/offer.entity.js';
import { CreateUserDto } from '../../shared/modules/user/dto/create-user.dto.js';
import { CreateOfferDto } from '../../shared/modules/offer/dto/create-offer.dto.js';

export const DEFAULT_DB_PORT = 27017;
export const DEFAULT_USER_PASSWORD = 123456;

export class ImportCommand implements Command {

  private readonly dbClient: DatabaseClient;
  private readonly offersService: DefaultOfferService;
  private readonly usersService: UserService;
  private readonly logger: Logger;
  private salt: string;

  constructor() {
    this.logger = new ConsoleLogger();
    this.dbClient = new MongoDatabaseClient(this.logger);
    this.offersService = new DefaultOfferService(this.logger, OfferModel);
    this.usersService = new DefaultUserService(this.logger, UserModel);
  }

  public getName(): string {
    return '--import';
  }

  public async execute(filename: string, dbUser: string, dbPassword: string, dbHost: string, dbName: string, salt: string, ..._parameters: string[]): Promise<void> {

    this.salt = salt;
    const mongoUri = getMongoURI(dbUser, dbPassword, dbHost, DEFAULT_DB_PORT, dbName);

    await this.dbClient.connect(mongoUri);

    //const [filename] = parameters;
    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onOfferReaded);
    fileReader.once('end', this.onImportCompleted);

    try {
      fileReader.read();
      //console.log(fileReader.toArray());
    } catch (error: unknown) {
      console.error(`Error parsing TSV file ${filename}`);
      console.error(getErrorMessage(error));
    }
  }

  onOfferReaded = async (offer: Offer, resolve: () => void) => {
    this.logger.info(`importing offer of user ${offer.user.email}`);
    const offerUserDto: CreateUserDto = {
      ...offer.user,
      password: DEFAULT_USER_PASSWORD.toString(),
    }
    try {
      const offerUser = await this.usersService.findOrCreate(offerUserDto, this.salt);
      const offerDto: CreateOfferDto = {
        ...offer,
        city: offer.city.name,
        user: offerUser.id,
      }
      await this.offersService.create(offerDto);
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error('Error Import user', error as Error);
      }
      else {
        throw error;
      }
    }

    resolve(); // сигнал что offer импортирован и можно продолжать читать в tsv file reader
  };

  onImportCompleted = (offersCount: number) => {
    console.info(`${offersCount} offers imported`);
  };
}
