import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BaseClassElementMetadata } from './BaseClassElementMetadata';
import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementTagMetadata
  extends BaseClassElementMetadata<ClassElementMetadataType.tag> {
  value: BindingTag;
}
