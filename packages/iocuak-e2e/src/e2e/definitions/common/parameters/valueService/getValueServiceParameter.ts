import { BindingType, ValueBinding } from '@cuaklabs/iocuak';

import { ValueServiceParameter } from './ValueServiceParameter';

export function getValueServiceParameter(): ValueServiceParameter {
  const value: unknown = Symbol('value');

  const binding: ValueBinding = {
    bindingType: BindingType.value,
    id: Symbol('value-service'),
    tags: [],
    value,
  };

  return {
    binding,
    service: value,
  };
}
