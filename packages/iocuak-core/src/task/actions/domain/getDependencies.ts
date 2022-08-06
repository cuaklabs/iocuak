import { mapIterable } from '@cuaklabs/iocuak-common';
import { ClassElementMetadata, ClassMetadata } from '@cuaklabs/iocuak-models';

import { ServiceDependencies } from '../../models/domain/ServiceDependencies';
import { TaskContext } from '../../models/domain/TaskContext';
import { getDependency } from './getDependency';

export function getDependencies(
  classMetadata: ClassMetadata,
  context: TaskContext,
): ServiceDependencies {
  const serviceDependencies: ServiceDependencies = {
    constructorArguments: classMetadata.constructorArguments.map(
      (classElementMetadata: ClassElementMetadata) =>
        getDependency(classElementMetadata, context),
    ),
    properties: new Map(
      mapIterable(
        classMetadata.properties.entries(),
        ([propertyName, property]: [string | symbol, ClassElementMetadata]): [
          string | symbol,
          unknown,
        ] => [propertyName, getDependency(property, context)],
      ),
    ),
  };

  return serviceDependencies;
}
