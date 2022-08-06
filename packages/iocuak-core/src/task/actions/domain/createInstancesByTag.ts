import { mapIterable, Tag } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { TaskContext } from '../../models/domain/TaskContext';

export function createInstancesByTag(
  tag: Tag,
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
