import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { getTypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope } from './getTypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope {
    constructor(
      @inject(typeServiceWithTransientScopeParameter.binding.id)
      public firstTypeServiceInstance: unknown,
      @inject(typeServiceWithTransientScopeParameter.binding.id)
      public secondTypeServiceInstance: unknown,
    ) {
      constructorSpy(firstTypeServiceInstance, secondTypeServiceInstance);
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScopeApi.singleton,
    tags: [],
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(
    TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope,
  );

  return {
    binding,
    dependencies: [typeServiceWithTransientScopeParameter],
    service:
      TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
