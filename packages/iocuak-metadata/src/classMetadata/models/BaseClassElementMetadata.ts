import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface BaseClassElementMetadata<
  TType extends ClassElementMetadataType,
> {
  type: TType;
}
