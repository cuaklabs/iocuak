import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithNoDependenciesParameter(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithNoDependenciesParameter {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithNoDependenciesParameter.name),
    scope: BindingScopeApi.request,
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
