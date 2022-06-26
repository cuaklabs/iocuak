import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
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
    tags: [],
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
