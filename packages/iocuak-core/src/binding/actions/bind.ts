import { Newable } from '@cuaklabs/iocuak-common';
import { BindOptions, TypeBinding } from '@cuaklabs/iocuak-models';

import { BindingService } from '../services/BindingService';
import { getBindingOrThrow } from './getBindingOrThrow';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  options: BindOptions,
  bindingService: BindingService,
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

  bindingService.set(serviceBinding);
}
