import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTypeServiceId(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithTypeServiceId {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: TypeServiceWithTypeServiceId,
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithTypeServiceId,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTypeServiceId);

  return {
    binding,
    service: TypeServiceWithTypeServiceId,
    spy: constructorSpy,
  };
}
