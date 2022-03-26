import { ServiceId } from '../../common/models/domain/ServiceId';
import { ClassMetadataExtensionApi } from '../models/api/ClassMetadataExtensionApi';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
import { getReflectMetadata } from '../utils/getReflectMetadata';
import { updateReflectMetadata } from '../utils/updateReflectMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';

export function injectFrom(
  classMetadataExtensionApi: ClassMetadataExtensionApi,
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const baseTypeClassMetadata: ClassMetadata | undefined = getReflectMetadata(
      classMetadataExtensionApi.type,
      MetadataKey.inject,
    );

    if (baseTypeClassMetadata !== undefined) {
      updateReflectMetadata(
        target,
        MetadataKey.inject,
        getDefaultClassMetadata(),
        composeUpdateReflectMetadataCallback(
          classMetadataExtensionApi,
          baseTypeClassMetadata,
        ),
      );
    }
  };

  return decorator;
}

function* chain<T>(...iterables: Iterable<T>[]): Iterable<T> {
  for (const iterable of iterables) {
    for (const element of iterable) {
      yield element;
    }
  }
}

function composeUpdateReflectMetadataCallback(
  classMetadataExtensionApi: ClassMetadataExtensionApi,
  baseTypeClassMetadata: ClassMetadata,
): (metadata: ClassMetadata) => ClassMetadata {
  const callback: (metadata: ClassMetadata) => ClassMetadata = (
    typeMetadata: ClassMetadata,
  ): ClassMetadata => ({
    constructorArguments: getExtendedConstructorArguments(
      classMetadataExtensionApi,
      baseTypeClassMetadata,
      typeMetadata,
    ),
    properties: getExtendedProperties(
      classMetadataExtensionApi,
      baseTypeClassMetadata,
      typeMetadata,
    ),
  });

  return callback;
}

function getExtendedConstructorArguments(
  classMetadataExtensionApi: ClassMetadataExtensionApi,
  baseTypeClassMetadata: ClassMetadata,
  typeMetadata: ClassMetadata,
): ServiceId[] {
  const extendConstructorArguments: boolean =
    classMetadataExtensionApi.extendConstructorArguments ?? false;

  let extendedConstructorArguments: ServiceId[];

  if (extendConstructorArguments) {
    extendedConstructorArguments = [
      ...baseTypeClassMetadata.constructorArguments,
    ];

    typeMetadata.constructorArguments.map(
      (serviceId: ServiceId, index: number) => {
        extendedConstructorArguments[index] = serviceId;
      },
    );
  } else {
    extendedConstructorArguments = typeMetadata.constructorArguments;
  }

  return extendedConstructorArguments;
}

function getExtendedProperties(
  classMetadataExtensionApi: ClassMetadataExtensionApi,
  baseTypeClassMetadata: ClassMetadata,
  typeMetadata: ClassMetadata,
): Map<string | symbol, ServiceId> {
  const extendProperties: boolean =
    classMetadataExtensionApi.extendProperties ?? false;

  let extendedProperties: Map<string | symbol, ServiceId>;

  if (extendProperties) {
    extendedProperties = new Map(
      chain(baseTypeClassMetadata.properties, typeMetadata.properties),
    );
  } else {
    extendedProperties = typeMetadata.properties;
  }

  return extendedProperties;
}
