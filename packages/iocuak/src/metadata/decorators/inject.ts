import { Prototype } from '../../common/models/domain/Prototype';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { isPrototype } from '../../common/utils/isPrototype';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
import { updateReflectMetadata } from '../utils/updateReflectMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';

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
      handleNonConstructorParameter(target, propertyKey);
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

function isMethodParameter(
  target: unknown,
  propertyKey: string | symbol | undefined,
): boolean {
  return isPrototype(target) && propertyKey !== '';
}

function handleNonConstructorParameter(
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  propertyKey: string | symbol | undefined,
): never {
  if (isMethodParameter(target, propertyKey)) {
    throw new Error(
      `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method ${propertyKey?.toString() ?? ''} at class ${
        target.constructor.name
      }`,
    );
  } else {
    throw new Error(
      'Found an @inject decorator in a non constructor parameter',
    );
  }
}
