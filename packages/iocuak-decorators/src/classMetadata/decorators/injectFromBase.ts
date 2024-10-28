import { Newable } from '@cuaklabs/iocuak-common';

import { getBaseType } from '../../common/utils/getBaseType';
import { BaseClassMetadataExtensionApi } from '../models/api/BaseClassMetadataExtensionApi';
import { ClassMetadataExtensionApi } from '../models/api/ClassMetadataExtensionApi';
import { injectFrom } from './injectFrom';

export function injectFromBase(
  baseClassMetadataExtensionApi?: BaseClassMetadataExtensionApi,
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): TFunction | void => {
    const baseType: Newable | undefined = getBaseType(
      target as unknown as Newable,
    );

    if (baseType !== undefined) {
      const baseTypeMetadataExtensionApi: ClassMetadataExtensionApi = {
        type: baseType,
      };

      if (baseClassMetadataExtensionApi !== undefined) {
        if (
          baseClassMetadataExtensionApi.extendConstructorArguments !== undefined
        ) {
          baseTypeMetadataExtensionApi.extendConstructorArguments =
            baseClassMetadataExtensionApi.extendConstructorArguments;
        }

        if (baseClassMetadataExtensionApi.extendProperties !== undefined) {
          baseTypeMetadataExtensionApi.extendProperties =
            baseClassMetadataExtensionApi.extendProperties;
        }
      }

      const injectFromDecorator: ClassDecorator = injectFrom(
        baseTypeMetadataExtensionApi,
      );

      injectFromDecorator(target);
    }
  };

  return decorator;
}
