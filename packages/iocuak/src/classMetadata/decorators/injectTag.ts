import { BindingTag } from '../../binding/models/domain/BindingTag';
import { ClassElementMetadataType } from '../models/domain/ClassElementMetadataType';
import { ClassElementTagMetadata } from '../models/domain/ClassElementTagMetadata';
import { injectBase } from './injectBase';

export function injectTag(
  tag: BindingTag,
): ParameterDecorator & PropertyDecorator {
  return injectBase(tag, tagToClassElementMatadata);
}

function tagToClassElementMatadata(tag: BindingTag): ClassElementTagMetadata {
  return {
    type: ClassElementMetadataType.tag,
    value: tag,
  };
}
