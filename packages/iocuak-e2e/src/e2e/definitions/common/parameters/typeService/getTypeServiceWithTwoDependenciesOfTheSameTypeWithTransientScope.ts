import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
  inject,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

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

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithTwoDependenciesOfTheSameTypeWithTransientScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
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
