import { ServiceId } from '@cuaklabs/iocuak-common';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

export function createInstanceInRequestScope(
  binding: TypeBinding,
  context: CreateInstanceTaskContext,
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
