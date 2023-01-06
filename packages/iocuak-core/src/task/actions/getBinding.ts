import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { lazyGetBindingOrThrow } from '../../binding/utils/lazyGetBindingOrThrow';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';

export function getBinding(
  serviceId: ServiceId,
  context: CreateInstanceTaskContext,
): Binding {
  const binding: Binding =
    context.services.bindingService.get(serviceId) ??
    lazyGetBindingOrThrow(serviceId);

  return binding;
}
