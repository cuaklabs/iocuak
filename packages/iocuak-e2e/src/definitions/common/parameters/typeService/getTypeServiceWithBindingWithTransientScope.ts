import {
  BindingScope,
  BindingType,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithTransientScope(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithTransientScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithBindingWithTransientScope.name),
    scope: BindingScope.transient,
    tags: [],
    type: TypeServiceWithBindingWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithTransientScope);

  return {
    binding,
    service: TypeServiceWithBindingWithTransientScope,
    spy: constructorSpy,
  };
}
