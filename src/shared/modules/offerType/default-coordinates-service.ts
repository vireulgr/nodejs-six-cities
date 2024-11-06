import { injectable, inject } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { CreateCoordinatesDto } from './dto/create-coordinates.dto.js';
import { CoordinatesService } from './coordinates-service.interface.js';
import { CoordinatesEntity, CoordinatesModel } from './coordinates.entity.js';
import { Component } from '../../types/component.enum.js';

@injectable()
export class DefaultCoordinatesService implements CoordinatesService {
  constructor(
    @inject(Component.CoordinatesModel) private readonly coordinatesModel: types.ModelType<CoordinatesEntity>
  ) {}

  public async create(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>> {
    return CoordinatesModel.create(dto);
  }

  public async findById(id: string): Promise<DocumentType<CoordinatesEntity> | null> {
    return this.coordinatesModel.findById(id).exec();
  }

  public async findByLatitudeLongitude(latitude: number, longitude: number): Promise<DocumentType<CoordinatesEntity> | null> {
    return this.coordinatesModel.findOne({latitude, longitude}).exec();
  }

  public async findOrCreate(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>> {
    const existedCoordinates = await this.findByLatitudeLongitude(dto.latitude, dto.longitude);

    if (existedCoordinates) {
      return existedCoordinates;
    }

    return this.create(dto);
  }
}
