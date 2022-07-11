import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadataApiType } from './ClassElementMetadatApiType';

export interface ClassElementTagMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadataApiType.tag> {
  value: BindingTag;
}
