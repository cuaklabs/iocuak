import { ServiceId } from '@cuaklabs/iocuak-common';

import { BindingTag } from '../../binding/models/domain/BindingTag';
import { BindingType } from '../../binding/models/domain/BindingType';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';

export function bindToValue<TInstance>(
  serviceId: ServiceId,
  tags: BindingTag[],
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
