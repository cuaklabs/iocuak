import { ServiceId, Tag } from '@cuaklabs/iocuak-common';

import { BindingType } from '../../binding/models/domain/BindingType';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
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
