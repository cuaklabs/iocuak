import { BaseClassMetadataExtensionApi } from '../../binding/models/api/BaseClassMetadataExtensionApi';
import { ClassMetadataExtensionApi } from '../../binding/models/api/ClassMetadataExtensionApi';
import { Newable } from '../../task/models/domain/Newable';
import { getBaseType } from '../../utils/getBaseType';
import { injectFrom } from './injectFrom';

export function injectFromBase(
  baseClassMetadataExtensionApi?: BaseClassMetadataExtensionApi,
): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const baseType: Newable | undefined = getBaseType(
      target as unknown as Newable,
    );

    if (baseType !== undefined) {
      const baseTypeMetadataExtensionApi: ClassMetadataExtensionApi = {
        extendConstructorArguments:
          baseClassMetadataExtensionApi?.extendConstructorArguments,
        extendProperties: baseClassMetadataExtensionApi?.extendProperties,
        type: baseType,
      };

      const injectFromDecorator: ClassDecorator = injectFrom(
        baseTypeMetadataExtensionApi,
      );

      injectFromDecorator(target);
    }
  };

  return decorator;
}
