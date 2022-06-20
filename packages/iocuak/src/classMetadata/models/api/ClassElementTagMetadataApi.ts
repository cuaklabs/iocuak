import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadatApiType } from './ClassElementMetadatApiType';

export interface ClassElementTagMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadatApiType.tag> {
  value: BindingTag;
}
