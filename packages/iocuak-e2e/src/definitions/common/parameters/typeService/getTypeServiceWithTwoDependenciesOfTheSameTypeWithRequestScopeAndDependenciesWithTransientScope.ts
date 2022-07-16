import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
  inject,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

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

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
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
