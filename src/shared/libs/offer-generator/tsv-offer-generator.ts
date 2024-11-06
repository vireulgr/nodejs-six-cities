import { JsonServerData } from '../../types/json-server-data.type.js';
import { OfferGenerator } from './offer-generator.interface.js';
import {
  getRandomArrayElement,
  getRandomArrayItems,
  randomFromRange
} from '../../helpers/common.js';
import dayjs from 'dayjs';

const PRICE_MIN = 100;
const PRICE_MAX = 100000;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(
    private mockData: JsonServerData
  ) { }

  generate(): string {
    const title = getRandomArrayElement(this.mockData.titles);
    const description = getRandomArrayElement(this.mockData.descriptions);
    const city = getRandomArrayElement(this.mockData.cities).name;
    const previewPicture = getRandomArrayElement(this.mockData.offerImages);
    const offerImages = getRandomArrayItems(this.mockData.offerImages).join(';');
    const isPremium = (Math.round(Math.random()) === 1) ? 'true' : 'false';
    const isBookmarked = (Math.round(Math.random()) === 1) ? 'true' : 'false';
    const rating = randomFromRange(1, 5).toFixed(2);
    const offerType = getRandomArrayElement(this.mockData.offerTypes);
    const rooms = Math.round(randomFromRange(1, 8)).toString();
    const guests = Math.round(randomFromRange(1, 10)).toString();
    const price = Math.round(randomFromRange(PRICE_MIN, PRICE_MAX)).toString();
    const comforts = getRandomArrayItems(this.mockData.comforts).join(';');
    const locationObject = getRandomArrayElement(this.mockData.locations);
    const locationString = `${locationObject.latitude};${locationObject.longitude}`;

    const email = getRandomArrayElement(this.mockData.emails);
    const avatarImage = getRandomArrayElement(this.mockData.avatarImages);
    const [firstName, lastName] = getRandomArrayElement(this.mockData.users).split(' ');

    const publicationTime = dayjs()
      .subtract(randomFromRange(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    return [
      title, description, publicationTime, city,
      previewPicture, offerImages,
      isPremium, isBookmarked, rating, offerType,
      rooms, guests, price, comforts,
      firstName, lastName, email, avatarImage,
      locationString
    ].join('\t');
  }
}
