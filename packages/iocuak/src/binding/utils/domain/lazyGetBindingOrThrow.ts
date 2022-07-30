import { Newable, ServiceId } from '@cuaklabs/iocuak-common';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { isFunction } from '../../../common/utils/isFunction';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { getBindingOrThrow } from './getBindingOrThrow';

export function lazyGetBindingOrThrow<TInstance, TArgs extends unknown[]>(
  serviceId: ServiceId,
): TypeBinding<TInstance, TArgs> {
  if (isFunction(serviceId)) {
    return getBindingOrThrow(serviceId as Newable<TInstance, TArgs>);
  } else {
    throw new Error(
      `No registered bindings found for type ${stringifyServiceId(serviceId)}`,
    );
  }
}
