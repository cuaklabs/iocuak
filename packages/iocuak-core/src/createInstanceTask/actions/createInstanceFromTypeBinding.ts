import { TypeBinding, BindingScope } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstanceInRequestScope } from './createInstanceInRequestScope';
import { createInstanceInSingletonScope } from './createInstanceInSingletonScope';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

export function createInstanceFromTypeBinding(
  binding: TypeBinding,
  context: CreateInstanceTaskContext,
): unknown {
  let instance: unknown;

  switch (binding.scope) {
    case BindingScope.request:
      instance = createInstanceInRequestScope(binding, context);
      break;
    case BindingScope.singleton:
      instance = createInstanceInSingletonScope(binding, context);
      break;
    case BindingScope.transient:
      instance = createInstanceInTransientScope(binding, context);
      break;
  }

  return instance;
}
