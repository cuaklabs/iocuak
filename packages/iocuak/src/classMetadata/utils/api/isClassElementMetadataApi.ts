import {
  ClassElementMetadataApi,
  ClassElementMetadataApiType,
} from '@cuaklabs/iocuak-models-api';

export function isClassElementMetadataApi(
  value: unknown,
): value is ClassElementMetadataApi {
  return Object.values(ClassElementMetadataApiType).includes(
    (value as ClassElementMetadataApi).type,
  );
}
