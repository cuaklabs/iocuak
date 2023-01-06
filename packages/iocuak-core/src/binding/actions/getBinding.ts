import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../../task/models/CreateInstanceTaskContext';
import { lazyGetBindingOrThrow } from './lazyGetBindingOrThrow';

export function getBinding(
  serviceId: ServiceId,
  context: CreateInstanceTaskContext,
): Binding {
  const binding: Binding =
    context.services.bindingService.get(serviceId) ??
    lazyGetBindingOrThrow(serviceId);

  return binding;
}
