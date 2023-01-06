import { Binding, BindingType } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';

export function createInstanceFromBinding(
  binding: Binding,
  context: CreateInstanceTaskContext,
): unknown {
  let instance: unknown;

  switch (binding.bindingType) {
    case BindingType.type:
      instance = createInstanceFromTypeBinding(binding, context);
      break;
    case BindingType.value:
      instance = binding.value;
      break;
  }

  return instance;
}
