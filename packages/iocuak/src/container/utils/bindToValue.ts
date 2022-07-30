import { ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { ValueBinding, BindingType } from '@cuaklabs/iocuak-models';

import { BindingService } from '../../binding/services/domain/BindingService';

export function bindToValue<TInstance>(
  serviceId: ServiceId,
  tags: Tag[],
  value: TInstance,
  containerBindingService: BindingService,
): void {
  const valueBinding: ValueBinding<TInstance> = {
    bindingType: BindingType.value,
    id: serviceId,
    tags: [...tags],
    value: value,
  };

  containerBindingService.set(valueBinding);
}
