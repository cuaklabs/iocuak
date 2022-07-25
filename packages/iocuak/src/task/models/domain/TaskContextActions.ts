import { Binding } from '@cuaklabs/iocuak-binding';
import { ClassMetadata } from '@cuaklabs/iocuak-class-metadata';

import { ServiceDependencies } from './ServiceDependencies';
import { TaskContext } from './TaskContext';

export interface TaskContextActions {
  createInstanceFromBinding(binding: Binding, context: TaskContext): unknown;

  getDependencies(
    classMetadata: ClassMetadata,
    context: TaskContext,
  ): ServiceDependencies;
}
