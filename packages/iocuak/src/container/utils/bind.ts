import { TypeBinding } from '@cuaklabs/iocuak-binding';
import { Newable } from '@cuaklabs/iocuak-common';

import { BindingService } from '../../binding/services/domain/BindingService';
import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';

export function bind<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
  containerBindingService: BindingService,
): void {
  const bindingFromType: TypeBinding<TInstance, TArgs> =
    getBindingOrThrow(type);

  containerBindingService.set(bindingFromType);
}
