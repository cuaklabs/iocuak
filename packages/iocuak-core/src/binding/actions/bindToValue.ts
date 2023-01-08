import { ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { ValueBinding, BindingType } from '@cuaklabs/iocuak-models';

import { BindingService } from '../services/BindingService';

export function bindToValue<TInstance>(
  serviceId: ServiceId,
  tags: Tag[],
  value: TInstance,
  bindingService: BindingService,
): void {
  const valueBinding: ValueBinding<TInstance> = {
    bindingType: BindingType.value,
    id: serviceId,
    tags: [...tags],
    value: value,
  };

  bindingService.set(valueBinding);
}
