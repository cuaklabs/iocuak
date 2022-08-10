import { Newable } from '@cuaklabs/iocuak-common';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { getBindingMetadata } from './getBindingMetadata';

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
