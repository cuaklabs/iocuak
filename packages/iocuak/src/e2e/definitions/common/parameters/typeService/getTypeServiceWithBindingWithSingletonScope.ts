import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithSingletonScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithSingletonScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithBindingWithSingletonScope.name),
    scope: BindingScopeApi.singleton,
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
