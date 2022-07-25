import { getBindingMetadata, TypeBinding } from '@cuaklabs/iocuak-binding';
import { Newable } from '@cuaklabs/iocuak-common';

export function getBindingOrThrow<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): TypeBinding<TInstance, TArgs> {
  const bindingFromType: TypeBinding<TInstance, TArgs> | undefined =
    getBindingMetadata(type);

  if (bindingFromType === undefined) {
    throw new Error(
      `No bindings found for type ${type.name}. An @injectable() decorator may be missing`,
    );
  } else {
    return bindingFromType;
  }
}
