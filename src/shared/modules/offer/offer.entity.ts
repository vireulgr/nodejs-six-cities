import { defaultClasses, getModelForClass, prop, modelOptions, Ref } from '@typegoose/typegoose';
import { CoordinatesEntity } from '../offerType/index.js';
import { UserEntity } from '../user/index.js';
import { OfferType, User, Comfort, City } from '../../types/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { CITIES } from '../../types/city.type.js';

// intentionally merge interface and class
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true
  }
})
export class OfferEntity extends defaultClasses.TimeStamps {

  // Наименование. Обязательное. Мин. длин 10 символов, макс. длина 100;
  @prop({required: true, trim: true})
  title: string;

  // Описание предложения. Обязательное. Мин. длина 20 символов, макс. длина 1024 символа;
  @prop({trim: true})
  description: string;

  // Дата публикации предложения. Обязательное.
  @prop()
  publicationTime: Date;

  // Город. Обязательное. Один из шести городов.
  @prop({required: true})
  city: City;

  // Превью изображения. Обязательное. Ссылка на изображение, которое используется в качестве превью;
  @prop()
  previewPic: string;

  // Фотографии жилья. Обязательное. Список ссылок на фотографии жилья. Всегда 6 фотографий;
  @prop()
  photos: string[];

  // Флаг «Премиум». Обязательное. Признак премиальности предложения;
  @prop()
  isPremium: boolean;

  // Флаг «Избранное». Обязательное. Признак того, что предложение принадлежит списку избранных предложений пользователя;
  @prop()
  isBookmarked: boolean;

  // Рейтинг. Обязательное. Число от 1 до 5. Допускаются числа с запятой (1 знак после запятой);
  @prop({min: 1, max: 5})
  rating: number;

  // Тип жилья. Обязательное. Один из вариантов: apartment, house, room, hotel;
  @prop({
     type: () => String,
     enum: OfferType
  })
  type: OfferType;

  // Количество комнат. Обязательное. Мин. 1, Макс. 8;
  @prop({required: true, min: 1, max: 8})
  rooms: number;

  // Количество гостей. Обязательное. Мин. 1, Макс. 10;
  @prop({required: true, min: 1, max: 10})
  guests: number;

  // Стоимость аренды. Обязательное. Мин. 100, Макс. 100 000;
  @prop({required: true, min: 100, max: 100000})
  price: number;

  // Удобства. Обязательное. Список удобств.
  @prop({
    type: () => String,
    enum: Comfort,
    default: [],
  })
  comforts: Comfort[];

  // Автор предложения. Обязательное. Ссылка на сущность «Пользователь»;
  @prop({
    ref: UserEntity,
    required: true,
    default: [],
    _id: false,
  })
  public user: Ref<User>;

  // Количество комментариев. Рассчитывается автоматически;
  // ???????

  // Координаты предложения для аренды. Обязательное. Координаты представлены широтой и долготой.
  @prop({
    ref: CoordinatesEntity,
    required: true,
  })
  public coordinates: Ref<CoordinatesEntity>;

  constructor(dto: CreateOfferDto) {
    super();
    const city = CITIES.find(({name}) => name === dto.city);
    if (!city) {
      throw new Error(`Cannot find city ${dto.city}`);
    }

    this.city = city;
    this.title = dto.title;// string;
    this.description = dto.description;// string;
    this.previewPic = dto.previewPic;// string;
    this.photos = dto.photos;// string[];
    this.isPremium = dto.isPremium;// boolean;
    this.isBookmarked = dto.isBookmarked;// boolean;
    this.rating = dto.rating;// number;
    //this.type = dto.type;// OfferType;
    this.rooms = dto.rooms;// number;
    this.guests = dto.guests;// number;
    this.price = dto.price;// number;
    //this.comforts = dto.comforts;// Comfort[];
    //this.user = dto.user;// User;
    //this.coordinates = dto.coordinates;// Coordinates;
  }
}

export const OfferModel = getModelForClass(OfferEntity);
