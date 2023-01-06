import { Binding, ClassMetadata } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from './CreateInstanceTaskContext';
import { ServiceDependencies } from './ServiceDependencies';

export interface TaskContextActions {
  createInstanceFromBinding(
    binding: Binding,
    context: CreateInstanceTaskContext,
  ): unknown;

  getDependencies(
    classMetadata: ClassMetadata,
    context: CreateInstanceTaskContext,
  ): ServiceDependencies;
}
