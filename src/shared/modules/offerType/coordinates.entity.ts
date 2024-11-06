import { defaultClasses, getModelForClass, prop, modelOptions } from '@typegoose/typegoose';
import { Coordinates } from '../../types/index.js';

// intentionally merge interface and class
export interface CoordinatesEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'coordinates',
    timestamps: true
  }
})
export class CoordinatesEntity extends defaultClasses.TimeStamps implements Coordinates {
  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;
}

export const CoordinatesModel = getModelForClass(CoordinatesEntity);
