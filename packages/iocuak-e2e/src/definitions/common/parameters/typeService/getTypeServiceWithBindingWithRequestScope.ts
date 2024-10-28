import {
  BindingScope,
  BindingType,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithRequestScope(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithRequestScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithBindingWithRequestScope.name),
    scope: BindingScope.request,
    tags: [],
    type: TypeServiceWithBindingWithRequestScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithRequestScope);

  return {
    binding,
    service: TypeServiceWithBindingWithRequestScope,
    spy: constructorSpy,
  };
}
