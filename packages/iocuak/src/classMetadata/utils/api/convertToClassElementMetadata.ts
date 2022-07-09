import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadatApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassElementMetadata } from '../../models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../models/domain/ClassElementMetadataType';

export function convertToClassElementMetadata(
  classElementMetadataApi: ClassElementMetadataApi,
): ClassElementMetadata {
  let classElementMetadata: ClassElementMetadata;

  switch (classElementMetadataApi.type) {
    case ClassElementMetadatApiType.serviceId:
      classElementMetadata = {
        type: ClassElementMetadataType.serviceId,
        value: classElementMetadataApi.value,
      };
      break;
    case ClassElementMetadatApiType.tag:
      classElementMetadata = {
        type: ClassElementMetadataType.tag,
        value: classElementMetadataApi.value,
      };
      break;
  }

  return classElementMetadata;
}
