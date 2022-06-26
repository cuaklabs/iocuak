import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { ValueBindingApi } from '../../../../../binding/models/api/ValueBindingApi';
import { ValueServiceParameter } from './ValueServiceParameter';

export function getValueServiceParameter(): ValueServiceParameter {
  const value: unknown = Symbol('value');

  const binding: ValueBindingApi = {
    bindingType: BindingTypeApi.value,
    id: Symbol('value-service'),
    tags: [],
    value,
  };

  return {
    binding,
    service: value,
  };
}
