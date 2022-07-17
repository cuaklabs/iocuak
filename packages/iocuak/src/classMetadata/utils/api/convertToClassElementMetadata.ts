import {
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-metadata';

import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadataApiType } from '../../models/api/ClassElementMetadatApiType';

export function convertToClassElementMetadata(
  classElementMetadataApi: ClassElementMetadataApi,
): ClassElementMetadata {
  let classElementMetadata: ClassElementMetadata;

  switch (classElementMetadataApi.type) {
    case ClassElementMetadataApiType.serviceId:
      classElementMetadata = {
        type: ClassElementMetadataType.serviceId,
        value: classElementMetadataApi.value,
      };
      break;
    case ClassElementMetadataApiType.tag:
      classElementMetadata = {
        type: ClassElementMetadataType.tag,
        value: classElementMetadataApi.value,
      };
      break;
  }

  return classElementMetadata;
}
