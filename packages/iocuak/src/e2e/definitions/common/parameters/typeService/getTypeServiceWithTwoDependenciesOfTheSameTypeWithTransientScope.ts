import sinon from 'sinon';

import { inject } from '../../../../../metadata/decorators/inject';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope {
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
      TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope.name,
    ),
    scope: BindingScopeApi.singleton,
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope);

  return {
    binding,
    dependencies: [typeServiceWithTransientScopeParameter],
    service: TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope,
    spy: constructorSpy,
  };
}
