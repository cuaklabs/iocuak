import { Binding } from '../../../binding/models/domain/Binding';
import { ClassElementMetadata } from '../../../classMetadata/models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../../classMetadata/models/domain/ClassElementMetadataType';
import { mapIterable } from '../../../common/utils/mapIterable';
import { TaskContext } from '../../models/domain/TaskContext';
import { getBinding } from './getBinding';

export function getDependency(
  classElementMetadata: ClassElementMetadata,
  context: TaskContext,
): unknown {
  let instanceDependency: unknown;

  switch (classElementMetadata.type) {
    case ClassElementMetadataType.serviceId: {
      const binding: Binding = getBinding(classElementMetadata.value, context);

      instanceDependency = context.actions.createInstanceFromBinding(
        binding,
        context,
      );
      break;
    }
    case ClassElementMetadataType.tag: {
      const bindings: Iterable<Binding> =
        context.services.bindingService.getByTag(
          classElementMetadata.value,
          true,
        );

      const instances: Iterable<unknown> = mapIterable(
        bindings,
        (binding: Binding) =>
          context.actions.createInstanceFromBinding(binding, context),
      );

      instanceDependency = [...instances];
      break;
    }
  }

  return instanceDependency;
}
