import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { TypeBinding } from '../../models/domain/TypeBinding';
import { MetadataService } from '../../services/domain/MetadataService';
import { getBindingOrThrow } from './getBindingOrThrow';

export function lazyGetBindingOrThrow<TInstance, TArgs extends unknown[]>(
  serviceId: ServiceId,
  metadataService: MetadataService,
): TypeBinding<TInstance, TArgs> {
  if (serviceId instanceof Function) {
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
