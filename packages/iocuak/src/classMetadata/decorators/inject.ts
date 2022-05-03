import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { updateReflectMetadata } from '../../reflectMetadata/utils/domain/updateReflectMetadata';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { getDefaultClassMetadata } from '../utils/domain/getDefaultClassMetadata';

export function inject(
  serviceId: ServiceId,
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol, // It may be undefined!!
    parameterIndex?: number,
  ): void => {
    if (parameterIndex === undefined) {
      return injectProperty(serviceId)(target, propertyKey);
    } else {
      return injectParameter(serviceId)(target, propertyKey, parameterIndex);
    }
  };

  return decorator;
}

function injectParameter(serviceId: ServiceId): ParameterDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      updateReflectMetadata(
        target,
        MetadataKey.inject,
        getDefaultClassMetadata(),
        (classMetadata: ClassMetadata): ClassMetadata => {
          classMetadata.constructorArguments[parameterIndex] = serviceId;

          return classMetadata;
        },
      );
    } else {
      throw new Error(
        `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "${
          propertyKey?.toString() ?? ''
        }" at class "${target.constructor.name}"`,
      );
    }
  };
}

function injectProperty(serviceId: ServiceId): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol): void => {
    updateReflectMetadata(
      target.constructor,
      MetadataKey.inject,
      getDefaultClassMetadata(),
      (classMetadata: ClassMetadata): ClassMetadata => {
        classMetadata.properties.set(propertyKey, serviceId);

        return classMetadata;
      },
    );
  };
}

function isConstructorParameter(
  target: unknown,
  propertyKey: string | symbol | undefined,
): boolean {
  return typeof target === 'function' && propertyKey === undefined;
}
