import { ClassMetadata, TypeBinding } from '@cuaklabs/iocuak-models';

import { getClassMetadata } from '../../classMetadata/utils/getClassMetadata';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { ServiceDependencies } from '../models/ServiceDependencies';

export function createInstanceInTransientScope(
  binding: TypeBinding,
  context: CreateInstanceTaskContext,
): unknown {
  if (context.servicesInstantiatedSet.has(binding.id)) {
    throw new Error('Circular dependency found!');
  } else {
    context.servicesInstantiatedSet.add(binding.id);

    const classMetadata: ClassMetadata = getClassMetadata(binding.type);

    const serviceDependencies: ServiceDependencies =
      context.actions.getDependencies(classMetadata, context);

    context.servicesInstantiatedSet.delete(binding.id);

    const instance: unknown = new binding.type(
      ...serviceDependencies.constructorArguments,
    );

    for (const [
      propertyName,
      propertyValue,
    ] of serviceDependencies.properties) {
      (instance as Record<string | symbol, unknown>)[propertyName] =
        propertyValue;
    }

    return instance;
  }
}
