import {
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-class-metadata';

import { Binding } from '../../../binding/models/domain/Binding';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstancesByTag } from './createInstancesByTag';
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
      instanceDependency = createInstancesByTag(
        classElementMetadata.value,
        context,
      );
      break;
    }
  }

  return instanceDependency;
}
