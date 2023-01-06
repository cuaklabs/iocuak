import {
  Binding,
  ClassElementMetadata,
  ClassElementMetadataType,
} from '@cuaklabs/iocuak-models';

import { getBinding } from '../../binding/actions/getBinding';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstancesByTag } from './createInstancesByTag';

export function getDependency(
  classElementMetadata: ClassElementMetadata,
  context: CreateInstanceTaskContext,
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
