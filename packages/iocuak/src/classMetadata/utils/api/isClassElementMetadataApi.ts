import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadatApiType } from '../../models/api/ClassElementMetadatApiType';

export function isClassElementMetadataApi(
  value: unknown,
): value is ClassElementMetadataApi {
  return Object.values(ClassElementMetadatApiType).includes(
    (value as ClassElementMetadataApi).type,
  );
}
