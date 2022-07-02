import { Binding } from '../../../binding/models/domain/Binding';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskContext } from '../../models/domain/TaskContext';

export function getBinding(
  serviceId: ServiceId,
  context: TaskContext,
): Binding {
  const binding: Binding =
    context.services.bindingService.get(serviceId) ??
    lazyGetBindingOrThrow(serviceId, context.services.metadataService);

  return binding;
}
