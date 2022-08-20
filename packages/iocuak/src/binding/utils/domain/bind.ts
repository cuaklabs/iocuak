import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService, getBindingOrThrow } from '@cuaklabs/iocuak-core';
import { TypeBinding } from '@cuaklabs/iocuak-models';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  containerBindingService: BindingService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> =
    getBindingOrThrow(type);

  containerBindingService.set(bindingFromType);
}
