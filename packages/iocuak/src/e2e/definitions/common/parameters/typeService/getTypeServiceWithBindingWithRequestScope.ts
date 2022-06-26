import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithRequestScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithBindingWithRequestScope {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithBindingWithRequestScope.name),
    scope: BindingScopeApi.request,
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
