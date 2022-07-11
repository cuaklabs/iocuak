import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadataApiType } from '../../models/api/ClassElementMetadatApiType';

export function isClassElementMetadataApi(
  value: unknown,
): value is ClassElementMetadataApi {
  return Object.values(ClassElementMetadataApiType).includes(
    (value as ClassElementMetadataApi).type,
  );
}
