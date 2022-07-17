import { Newable } from '@cuaklabs/iocuak-common';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { isFunction } from '../../../common/utils/isFunction';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { getBindingOrThrow } from './getBindingOrThrow';

export function lazyGetBindingOrThrow<TInstance, TArgs extends unknown[]>(
  serviceId: ServiceId,
  metadataService: MetadataService,
): TypeBinding<TInstance, TArgs> {
  if (isFunction(serviceId)) {
    return getBindingOrThrow(
      serviceId as Newable<TInstance, TArgs>,
      metadataService,
    );
  } else {
    throw new Error(
      `No registered bindings found for type ${stringifyServiceId(serviceId)}`,
    );
  }
}
