import { Newable } from '@cuaklabs/iocuak-common';

import { TypeBinding } from '../../binding/models/domain/TypeBinding';
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
