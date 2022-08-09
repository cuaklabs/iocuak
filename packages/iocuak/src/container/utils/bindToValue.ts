import { ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { BindingService } from '@cuaklabs/iocuak-core';
import { ValueBinding, BindingType } from '@cuaklabs/iocuak-models';

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
