import { Coordinates } from "../../../types/index.js";

export class CreateOfferDto {
  title: string;
  description: string;
  city: string;
  previewPic: string;
  photos: string[];
  isPremium: boolean;
  isBookmarked: boolean;
  rating: number;
  type: string;
  rooms: number;
  guests: number;
  price: number;
  comforts: string[];
  user: string; // email
  coordinates: Coordinates;
}
