import { ClassElementMetadataApiType } from './ClassElementMetadatApiType';

export interface BaseClassElementMetadataApi<
  TType extends ClassElementMetadataApiType,
> {
  type: TType;
}
