import { ServiceId } from '../../../common/models/domain/ServiceId';
import { mapIterable } from '../../../common/utils/mapIterable';
import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadatApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { ClassMetadata } from '../../models/domain/ClassMetadata';

export function convertToClassMetadataApi(
  classMetadata: ClassMetadata,
): ClassMetadataApi {
  const classMetadataApiConstructorArguments: ClassElementMetadataApi[] =
    classMetadata.constructorArguments.map(serviceIdToClassMetadataApi);
  const classMetadataApiProperties: Map<
    string | symbol,
    ClassElementMetadataApi
  > = new Map(
    mapIterable(
      classMetadata.properties.entries(),
      ([key, serviceId]: [string | symbol, ServiceId]) => [
        key,
        serviceIdToClassMetadataApi(serviceId),
      ],
    ),
  );

  return {
    constructorArguments: classMetadataApiConstructorArguments,
    properties: classMetadataApiProperties,
  };
}

function serviceIdToClassMetadataApi(
  serviceId: ServiceId,
): ClassElementMetadataApi {
  return {
    type: ClassElementMetadatApiType.serviceId,
    value: serviceId,
  };
}
