import { readFileSync } from 'node:fs';
import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';

import { FileReader } from './file-reader.interface.js';

import { Offer, City, OfferType, User, Coordinates, Comfort } from '../../types/index.js';
import { CITIES } from '../../types/city.type.js';


// events: 'line' - offer (Offer)
//          'end' - end of parsing (number of events)
export class TSVFileReader extends EventEmitter implements FileReader {
  private rawData = '';
  private CHUNK_SIZE = 16384; // Math.pow(2, 15);

  constructor(
    private fileName: string
  ) {
    super();
  }

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('Data is not valid');
    }
  }

  private parseLineToCity(line: string): City {
    const city = CITIES.find(({name}) => name === line);
    if (!city) {
      throw new Error(`cannot find city ${line}`);
    }
    return city;
  }

  private parseLineToPhotos(line: string): string[] {
    return line.split(';');
  }

  private parseLineToComforts(line: string): Comfort[] {
    return line.split(';').map((part) => Comfort[part as Comfort]);
  }

  private parseUser(firstName: string, lastName: string, email: string, avatarPath: string): User {
    return { firstName, lastName, email, avatarPath };
  }

  private parseLineToCoordinates(line: string): Coordinates {
    const [lat, long] = line.split(';');
    return { latitude: Number.parseFloat(lat), longitude: Number.parseFloat(long) };
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      publicationTime,
      city,
      previewPic,
      photos,
      isPremium,
      isBookmarked,
      rating,
      type,
      rooms,
      guests,
      price,
      comforts,
      firstName,
      lastName,
      userEmail,
      avatarPath,
      coordinates,
    ] = line.split('\t');

    return {
      title,
      description,
      publicationTime,
      city: this.parseLineToCity(city),
      previewPic,
      photos: this.parseLineToPhotos(photos),
      isPremium: isPremium.toLowerCase() === 'true',
      isBookmarked: isBookmarked.toLowerCase() === 'true',
      rating: Number.parseFloat(rating),
      type: OfferType[type as OfferType],
      rooms: Number.parseInt(rooms, 10),
      guests: Number.parseInt(guests, 10),
      price: Number.parseFloat(price),
      comforts: this.parseLineToComforts(comforts),
      user: this.parseUser(firstName, lastName, userEmail, avatarPath),
      coordinates: this.parseLineToCoordinates(coordinates),
    };
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData.split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  public async read(): Promise<void> {
    this.rawData = readFileSync(this.fileName, { encoding: 'utf-8' });
    const options = {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf8' as const,
    };
    const readStream = createReadStream(this.fileName, options);

    let remainingData = '';
    let nextLinePosition = -1;
    let readLinesCount = 0;
    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        nextLinePosition += 1;
        const completeLine = remainingData.slice(0, nextLinePosition);
        remainingData = remainingData.slice(nextLinePosition);
        readLinesCount += 1;

        const parsedOffer = this.parseLineToOffer(completeLine);

        // для того чтобы не было гонки данных при добавлении в БД
        // В обработчике события line нужно будет вызвать resolve
        await new Promise((resolve) => {
          this.emit('line', parsedOffer, resolve);
        });
        //this.emit('line', parsedOffer);
      }
    }

    this.emit('end', readLinesCount);
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
