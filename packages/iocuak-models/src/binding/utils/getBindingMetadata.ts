import { Newable } from '@cuaklabs/iocuak-common';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { bindingReflectKey } from '../../reflectMetadata/models/bindingReflectKey';
import { TypeBinding } from '../models/TypeBinding';

export function getBindingMetadata<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): TypeBinding<TInstance, TArgs> | undefined {
  const binding: TypeBinding<TInstance, TArgs> | undefined = getReflectMetadata(
    type,
    bindingReflectKey,
  );

  return binding;
}
