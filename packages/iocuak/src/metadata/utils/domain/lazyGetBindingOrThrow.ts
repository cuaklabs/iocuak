import { ServiceId } from '../../../common/models/domain/ServiceId';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { Binding } from '../../models/domain/Binding';
import { BindingType } from '../../models/domain/BindingType';
import { getDefaultBindingScope } from './getDefaultBindingScope';

export function lazyGetBindingOrThrow(serviceId: ServiceId): Binding {
  if (serviceId instanceof Function) {
    return {
      bindingType: BindingType.type,
      id: serviceId,
      scope: getDefaultBindingScope(),
      type: serviceId,
    };
  } else {
    throw new Error(
      `No bindings found for type ${stringifyServiceId(serviceId)}`,
    );
  }
}
