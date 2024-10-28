import {
  BindingScope,
  BindingType,
  inject,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope(): TypeServiceParameter {
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

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithSingletonScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
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
