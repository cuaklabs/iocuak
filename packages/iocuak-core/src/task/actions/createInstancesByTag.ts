import { mapIterable, Tag } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';

export function createInstancesByTag(
  tag: Tag,
  context: CreateInstanceTaskContext,
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
