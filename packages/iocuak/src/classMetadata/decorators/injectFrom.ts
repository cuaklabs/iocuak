import {
  ClassElementMetadata,
  ClassMetadata,
  classMetadataReflectKey,
  getDefaultClassMetadata,
} from '@cuaklabs/iocuak-class-metadata';
import {
  getReflectMetadata,
  updateReflectMetadata,
} from '@cuaklabs/iocuak-reflect-metadata-utils';

import { chain } from '../../common/utils/chain';
import { ClassMetadataExtensionApi } from '../models/api/ClassMetadataExtensionApi';

export function injectFrom(
  classMetadataExtensionApi: ClassMetadataExtensionApi,
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const baseTypeClassMetadata: ClassMetadata | undefined = getReflectMetadata(
      classMetadataExtensionApi.type,
      classMetadataReflectKey,
    );

    if (baseTypeClassMetadata !== undefined) {
      updateReflectMetadata(
        target,
        classMetadataReflectKey,
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
): ClassElementMetadata[] {
  const extendConstructorArguments: boolean =
    classMetadataExtensionApi.extendConstructorArguments ?? false;

  let extendedConstructorArguments: ClassElementMetadata[];

  if (extendConstructorArguments) {
    extendedConstructorArguments = [
      ...baseTypeClassMetadata.constructorArguments,
    ];

    typeMetadata.constructorArguments.map(
      (classElementMetadata: ClassElementMetadata, index: number) => {
        extendedConstructorArguments[index] = classElementMetadata;
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
): Map<string | symbol, ClassElementMetadata> {
  const extendProperties: boolean =
    classMetadataExtensionApi.extendProperties ?? false;

  let extendedProperties: Map<string | symbol, ClassElementMetadata>;

  if (extendProperties) {
    extendedProperties = new Map(
      chain(baseTypeClassMetadata.properties, typeMetadata.properties),
    );
  } else {
    extendedProperties = typeMetadata.properties;
  }

  return extendedProperties;
}
