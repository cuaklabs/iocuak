import { ServiceId } from '../../common/models/domain/ServiceId';
import { BindingType } from '../../metadata/models/domain/BindingType';
import { ValueBinding } from '../../metadata/models/domain/ValueBinding';
import { ContainerBindingService } from '../services/domain/ContainerBindingService';

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
