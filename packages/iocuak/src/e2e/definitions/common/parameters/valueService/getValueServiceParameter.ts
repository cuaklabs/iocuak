import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { ValueBindingApi } from '../../../../../metadata/models/api/ValueBindingApi';
import { ValueServiceParameter } from './ValueServiceParameter';

export function getValueServiceParameter(): ValueServiceParameter {
  const value: unknown = Symbol('value');

  const binding: ValueBindingApi = {
    bindingType: BindingTypeApi.value,
    id: Symbol('value-service'),
    value,
  };

  return {
    binding,
    service: value,
  };
}
