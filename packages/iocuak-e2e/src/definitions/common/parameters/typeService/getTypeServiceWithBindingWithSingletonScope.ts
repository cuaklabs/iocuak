import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithSingletonScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithSingletonScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithBindingWithSingletonScope.name),
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithBindingWithSingletonScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithSingletonScope);

  return {
    binding,
    service: TypeServiceWithBindingWithSingletonScope,
    spy: constructorSpy,
  };
}
