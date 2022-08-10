import { Newable } from '@cuaklabs/iocuak-common';
import { bindingReflectKey, TypeBinding } from '@cuaklabs/iocuak-models';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

export function getBindingMetadata<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): TypeBinding<TInstance, TArgs> | undefined {
  const binding: TypeBinding<TInstance, TArgs> | undefined = getReflectMetadata(
    type,
    bindingReflectKey,
  );

  return binding;
}
