import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

export function createInstanceInSingletonScope(
  binding: TypeBinding,
  context: TaskContext,
): unknown {
  const serviceId: ServiceId = binding.id;

  const instanceFromRequestScope: unknown =
    context.services.containerSingletonService.get(serviceId);

  let instance: unknown;

  if (instanceFromRequestScope === undefined) {
    instance = createInstanceInTransientScope(binding, context);

    context.services.containerSingletonService.set(serviceId, instance);
  } else {
    instance = instanceFromRequestScope;
  }

  return instance;
}
