import { Binding } from '@cuaklabs/iocuak-binding';
import { ServiceId } from '@cuaklabs/iocuak-common';

import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { TaskContext } from '../../models/domain/TaskContext';

export function getBinding(
  serviceId: ServiceId,
  context: TaskContext,
): Binding {
  const binding: Binding =
    context.services.bindingService.get(serviceId) ??
    lazyGetBindingOrThrow(serviceId);

  return binding;
}
