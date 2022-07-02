import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { mapIterable } from '../../../common/utils/mapIterable';
import { TaskContext } from '../../models/domain/TaskContext';

export function createInstancesByTag(
  tag: BindingTag,
  context: TaskContext,
): unknown[] {
  const bindings: Iterable<Binding> = context.services.bindingService.getByTag(
    tag,
    true,
  );

  const instancesIterable: Iterable<unknown> = mapIterable(
    bindings,
    (binding: Binding) =>
      context.actions.createInstanceFromBinding(binding, context),
  );

  const instances: unknown[] = [...instancesIterable];

  return instances;
}
