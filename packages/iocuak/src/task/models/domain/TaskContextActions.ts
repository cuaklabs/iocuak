import { Binding, ClassMetadata } from '@cuaklabs/iocuak-models';

import { ServiceDependencies } from './ServiceDependencies';
import { TaskContext } from './TaskContext';

export interface TaskContextActions {
  createInstanceFromBinding(binding: Binding, context: TaskContext): unknown;

  getDependencies(
    classMetadata: ClassMetadata,
    context: TaskContext,
  ): ServiceDependencies;
}
