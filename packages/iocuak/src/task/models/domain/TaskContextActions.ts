import { ClassMetadata } from '@cuaklabs/iocuak-class-metadata';

import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceDependencies } from './ServiceDependencies';
import { TaskContext } from './TaskContext';

export interface TaskContextActions {
  createInstanceFromBinding(binding: Binding, context: TaskContext): unknown;

  getDependencies(
    classMetadata: ClassMetadata,
    context: TaskContext,
  ): ServiceDependencies;
}
