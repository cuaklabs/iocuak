import sinon from 'sinon';

import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
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
