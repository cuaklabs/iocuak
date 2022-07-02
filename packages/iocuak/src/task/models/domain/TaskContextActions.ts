import { Binding } from '../../../binding/models/domain/Binding';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceDependencies } from '../../../createInstanceTask/models/domain/ServiceDependencies';
import { TaskContext } from './TaskContext';

export interface TaskContextActions {
  createInstanceFromBinding(binding: Binding, context: TaskContext): unknown;

  getDependencies(
    classMetadata: ClassMetadata,
    context: TaskContext,
  ): ServiceDependencies;
}
