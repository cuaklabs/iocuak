import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstanceFromTypeBinding } from './createInstanceFromTypeBinding';

export function createInstanceFromBinding(
  binding: Binding,
  context: TaskContext,
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
