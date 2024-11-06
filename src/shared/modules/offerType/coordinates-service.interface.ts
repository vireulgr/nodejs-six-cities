import { DocumentType } from '@typegoose/typegoose';
import { CoordinatesEntity } from './coordinates.entity.js';
import { CreateCoordinatesDto } from './dto/create-coordinates.dto.js';

export interface CoordinatesService {
  create(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>>;
  findOrCreate(dto: CreateCoordinatesDto): Promise<DocumentType<CoordinatesEntity>>;
}
