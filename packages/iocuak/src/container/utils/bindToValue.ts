import { BindingType } from '../../binding/models/domain/BindingType';
import { ValueBinding } from '../../binding/models/domain/ValueBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { ServiceId } from '../../common/models/domain/ServiceId';

export function bindToValue<TInstance>(
  serviceId: ServiceId,
  value: TInstance,
  containerBindingService: BindingService,
): void {
  const valueBinding: ValueBinding<TInstance> = {
    bindingType: BindingType.value,
    id: serviceId,
    value: value,
  };

  containerBindingService.set(valueBinding);
}
