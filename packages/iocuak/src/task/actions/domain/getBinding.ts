import { ServiceId } from '@cuaklabs/iocuak-common';

import { Binding } from '../../../binding/models/domain/Binding';
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
