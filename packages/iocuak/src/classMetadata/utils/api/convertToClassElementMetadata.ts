import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadataApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassElementMetadata } from '../../models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../models/domain/ClassElementMetadataType';

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
