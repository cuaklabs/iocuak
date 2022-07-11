import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
  inject,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope } from './getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithSingletonScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope {
    constructor(
      @inject(typeServiceWithSingletonScopeParameter.binding.id)
      public firstTypeServiceInstance: unknown,
      @inject(typeServiceWithSingletonScopeParameter.binding.id)
      public secondTypeServiceInstance: unknown,
    ) {
      constructorSpy(firstTypeServiceInstance, secondTypeServiceInstance);
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(
    TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope,
  );

  return {
    binding,
    dependencies: [typeServiceWithSingletonScopeParameter],
    service:
      TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
