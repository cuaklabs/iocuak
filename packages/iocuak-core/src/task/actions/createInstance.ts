import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { TaskContext } from '../models/TaskContext';
import { createInstanceFromBinding } from './createInstanceFromBinding';
import { getBinding } from './getBinding';

export function createInstance(
  serviceId: ServiceId,
  context: TaskContext,
): unknown {
  const binding: Binding = getBinding(serviceId, context);

  const instance: unknown = createInstanceFromBinding(binding, context);

  return instance;
}
