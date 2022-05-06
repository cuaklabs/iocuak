import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementMetadataBase<
  TType extends ClassElementMetadataType,
> {
  type: TType;
}
