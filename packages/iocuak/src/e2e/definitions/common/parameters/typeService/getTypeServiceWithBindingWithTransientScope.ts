import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithTransientScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithTransientScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithBindingWithTransientScope.name),
    scope: BindingScopeApi.transient,
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
