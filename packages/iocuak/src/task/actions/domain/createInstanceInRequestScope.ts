import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

export function createInstanceInRequestScope(
  binding: TypeBinding,
  context: TaskContext,
): unknown {
  const requestId: symbol = context.requestId;
  const serviceId: ServiceId = binding.id;

  const instanceFromRequestScope: unknown =
    context.services.containerRequestService.get(requestId, serviceId);

  let instance: unknown;

  if (instanceFromRequestScope === undefined) {
    instance = createInstanceInTransientScope(binding, context);

    context.services.containerRequestService.set(
      requestId,
      serviceId,
      instance,
    );
  } else {
    instance = instanceFromRequestScope;
  }

  return instance;
}
