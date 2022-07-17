import { Tag } from '@cuaklabs/iocuak-common';

import { BaseClassElementMetadataApi } from './BaseClassElementMetadataApi';
import { ClassElementMetadataApiType } from './ClassElementMetadatApiType';

export interface ClassElementTagMetadataApi
  extends BaseClassElementMetadataApi<ClassElementMetadataApiType.tag> {
  value: Tag;
}
