import {
  BindingScope,
  BindingType,
  inject,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();

  class TypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope {
    constructor(
      @inject(typeServiceWithTransientScopeParameter.binding.id)
      public typeServiceInstance: unknown,
    ) {
      constructorSpy(typeServiceInstance);
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope);

  return {
    binding,
    dependencies: [typeServiceWithTransientScopeParameter],
    service:
      TypeServiceWithBindingWithSingletonScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
