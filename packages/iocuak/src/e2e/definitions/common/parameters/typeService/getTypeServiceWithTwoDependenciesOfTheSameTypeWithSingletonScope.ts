import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithSingletonScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithSingletonScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope {
    constructor(
      @inject(typeServiceWithSingletonScopeParameter.binding.id)
      public firstTypeServiceInstance: unknown,
      @inject(typeServiceWithSingletonScopeParameter.binding.id)
      public secondTypeServiceInstance: unknown,
    ) {
      constructorSpy(firstTypeServiceInstance, secondTypeServiceInstance);
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope.name,
    ),
    scope: BindingScopeApi.singleton,
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope);

  return {
    binding,
    dependencies: [typeServiceWithSingletonScopeParameter],
    service: TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope,
    spy: constructorSpy,
  };
}
