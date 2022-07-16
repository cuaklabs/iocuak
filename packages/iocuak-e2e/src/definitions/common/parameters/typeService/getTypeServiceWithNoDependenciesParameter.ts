import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithNoDependenciesParameter(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithNoDependenciesParameter {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithNoDependenciesParameter.name),
    scope: BindingScope.request,
    tags: [],
    type: TypeServiceWithNoDependenciesParameter,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithNoDependenciesParameter);

  return {
    binding,
    service: TypeServiceWithNoDependenciesParameter,
    spy: constructorSpy,
  };
}
