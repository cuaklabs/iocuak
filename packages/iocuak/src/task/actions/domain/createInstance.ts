import { Binding } from '../../../binding/models/domain/Binding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceFromBinding } from './createInstanceFromBinding';
import { getBinding } from './getBinding';

export function createInstance(
  serviceId: ServiceId,
  context: TaskContext,
): unknown {
  const binding: Binding = getBinding(serviceId, context);

  const instance: unknown = createInstanceFromBinding(binding, context);

  return instance;
}
