import { mapIterable } from '@cuaklabs/iocuak-common';
import { ClassElementMetadata, ClassMetadata } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { ServiceDependencies } from '../models/ServiceDependencies';
import { getDependency } from './getDependency';

export function getDependencies(
  classMetadata: ClassMetadata,
  context: CreateInstanceTaskContext,
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
