import { Newable } from '../../../common/models/domain/Newable';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { MetadataService } from '../../services/domain/MetadataService';

export function getBindingOrThrow<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  metadataService: MetadataService,
): TypeBinding<TInstance, TArgs> {
  const bindingFromType: TypeBinding<TInstance, TArgs> | undefined =
    metadataService.getBindingMetadata(type);

  if (bindingFromType === undefined) {
    throw new Error(
      `No bindings found for type ${type.name}. An @injectable() decorator may be missing`,
    );
  } else {
    return bindingFromType;
  }
}
