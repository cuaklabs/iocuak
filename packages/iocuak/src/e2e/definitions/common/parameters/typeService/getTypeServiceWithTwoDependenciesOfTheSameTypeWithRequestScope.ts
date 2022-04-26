import sinon from 'sinon';

import { inject } from '../../../../../metadata/decorators/inject';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithRequestScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithRequestScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope {
    constructor(
      @inject(typeServiceWithRequestScopeParameter.binding.id)
      public firstTypeServiceInstance: unknown,
      @inject(typeServiceWithRequestScopeParameter.binding.id)
      public secondTypeServiceInstance: unknown,
    ) {
      constructorSpy(firstTypeServiceInstance, secondTypeServiceInstance);
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope.name,
    ),
    scope: BindingScopeApi.singleton,
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope);

  return {
    binding,
    dependencies: [typeServiceWithRequestScopeParameter],
    service: TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope,
    spy: constructorSpy,
  };
}
