import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { getTypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope } from './getTypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithRequestScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope {
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
      TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScopeApi.singleton,
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(
    TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope,
  );

  return {
    binding,
    dependencies: [typeServiceWithRequestScopeParameter],
    service:
      TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
