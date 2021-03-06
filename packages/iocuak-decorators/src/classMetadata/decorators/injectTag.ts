import { Tag } from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataType,
  ClassElementTagMetadata,
} from '@cuaklabs/iocuak-models';

import { injectBase } from './injectBase';

export function injectTag(tag: Tag): ParameterDecorator & PropertyDecorator {
  return injectBase(tag, tagToClassElementMatadata);
}

function tagToClassElementMatadata(tag: Tag): ClassElementTagMetadata {
  return {
    type: ClassElementMetadataType.tag,
    value: tag,
  };
}
