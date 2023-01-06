import { ServiceId } from '@cuaklabs/iocuak-common';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

export function createInstanceInSingletonScope(
  binding: TypeBinding,
  context: CreateInstanceTaskContext,
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
