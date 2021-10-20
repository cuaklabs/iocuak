import { ServiceId } from '../../task/models/domain/ServiceId';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
import { updateReflectMetadata } from '../utils/updateReflectMetadata';

export function inject(
  serviceId: ServiceId,
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol,
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

function getDefaultClassMetadata(): ClassMetadata {
  return {
    constructorArguments: [],
    properties: new Map(),
  };
}

function injectParameter(serviceId: ServiceId): ParameterDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    _propertyKey: string | symbol,
    parameterIndex: number,
  ): void => {
    updateReflectMetadata(
      target,
      MetadataKey.inject,
      getDefaultClassMetadata(),
      (classMetadata: ClassMetadata): ClassMetadata => {
        classMetadata.constructorArguments[parameterIndex] = serviceId;

        return classMetadata;
      },
    );
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
