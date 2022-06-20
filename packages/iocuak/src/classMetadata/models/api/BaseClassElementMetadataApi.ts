import { ClassElementMetadatApiType } from './ClassElementMetadatApiType';

export interface BaseClassElementMetadataApi<
  TType extends ClassElementMetadatApiType,
> {
  type: TType;
}
