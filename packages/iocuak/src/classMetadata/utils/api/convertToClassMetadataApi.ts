import {
  ClassElementMetadata,
  ClassElementMetadataType,
  ClassMetadata,
} from '@cuaklabs/iocuak-class-metadata';

import { mapIterable } from '../../../common/utils/mapIterable';
import { ClassElementMetadataApi } from '../../models/api/ClassElementMetadataApi';
import { ClassElementMetadataApiType } from '../../models/api/ClassElementMetadatApiType';
import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';

export function convertToClassMetadataApi(
  classMetadata: ClassMetadata,
): ClassMetadataApi {
  const classMetadataApiConstructorArguments: ClassElementMetadataApi[] =
    classMetadata.constructorArguments.map(
      classElementMetadataToClassElementMetadataApi,
    );
  const classMetadataApiProperties: Map<
    string | symbol,
    ClassElementMetadataApi
  > = new Map(
    mapIterable(
      classMetadata.properties.entries(),
      ([key, classElementMetadata]: [
        string | symbol,
        ClassElementMetadata,
      ]) => [
        key,
        classElementMetadataToClassElementMetadataApi(classElementMetadata),
      ],
    ),
  );

  return {
    constructorArguments: classMetadataApiConstructorArguments,
    properties: classMetadataApiProperties,
  };
}

function classElementMetadataToClassElementMetadataApi(
  classElementMetadata: ClassElementMetadata,
): ClassElementMetadataApi {
  switch (classElementMetadata.type) {
    case ClassElementMetadataType.serviceId:
      return {
        type: ClassElementMetadataApiType.serviceId,
        value: classElementMetadata.value,
      };
    case ClassElementMetadataType.tag:
      return {
        type: ClassElementMetadataApiType.tag,
        value: classElementMetadata.value,
      };
  }
}
