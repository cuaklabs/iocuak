import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { ClassElementMetadataBase } from './ClassElementMetadataBase';
import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementTagMetadata
  extends ClassElementMetadataBase<ClassElementMetadataType.tag> {
  value: BindingTag;
}
