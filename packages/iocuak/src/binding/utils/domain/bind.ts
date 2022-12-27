import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService, getBindingOrThrow } from '@cuaklabs/iocuak-core';
import { BindOptions, TypeBinding } from '@cuaklabs/iocuak-models';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  options: BindOptions,
  containerBindingService: BindingService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> =
    getBindingOrThrow(type);

  let serviceBinding: TypeBinding<TInstance, TArgs>;

  if (options.scope === undefined) {
    serviceBinding = bindingFromType;
  } else {
    serviceBinding = {
      ...bindingFromType,
      scope: options.scope,
    };
  }

  containerBindingService.set(serviceBinding);
}
