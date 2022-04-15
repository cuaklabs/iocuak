import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { BindingType } from '../../metadata/models/domain/BindingType';
import { ValueBinding } from '../../metadata/models/domain/ValueBinding';

export function bindToValue<TInstance>(
  serviceId: ServiceId,
  value: TInstance,
  containerBindingService: ContainerBindingService,
): void {
  const valueBinding: ValueBinding<TInstance> = {
    bindingType: BindingType.value,
    id: serviceId,
    value: value,
  };

  containerBindingService.set(valueBinding);
}
