import { Tag } from '@cuaklabs/iocuak-common';

import { BaseClassElementMetadata } from './BaseClassElementMetadata';
import { ClassElementMetadataType } from './ClassElementMetadataType';

export interface ClassElementTagMetadata
  extends BaseClassElementMetadata<ClassElementMetadataType.tag> {
  value: Tag;
}
