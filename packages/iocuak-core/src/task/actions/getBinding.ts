import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { lazyGetBindingOrThrow } from '../../binding/utils/lazyGetBindingOrThrow';
import { TaskContext } from '../models/TaskContext';

export function getBinding(
  serviceId: ServiceId,
  context: TaskContext,
): Binding {
  const binding: Binding =
    context.services.bindingService.get(serviceId) ??
    lazyGetBindingOrThrow(serviceId);

  return binding;
}
