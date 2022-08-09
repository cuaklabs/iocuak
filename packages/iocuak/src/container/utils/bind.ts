import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService } from '@cuaklabs/iocuak-core';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  containerBindingService: BindingService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> =
    getBindingOrThrow(type);

  containerBindingService.set(bindingFromType);
}
