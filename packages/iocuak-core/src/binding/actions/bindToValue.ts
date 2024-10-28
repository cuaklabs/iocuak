import { ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { BindingType, ValueBinding } from '@cuaklabs/iocuak-models';

import { BindingService } from '../services/BindingService';

export function bindToValue(
  serviceId: ServiceId,
  tags: Tag[],
  value: unknown,
  bindingService: BindingService,
): void {
  const valueBinding: ValueBinding<unknown> = {
    bindingType: BindingType.value,
    id: serviceId,
    tags: [...tags],
    value: value,
  };

  bindingService.set(valueBinding);
}
