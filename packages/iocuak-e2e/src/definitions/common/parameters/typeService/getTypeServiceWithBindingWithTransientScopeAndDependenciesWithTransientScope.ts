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

export function getTypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();

  class TypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope {
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
      TypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScope.transient,
    tags: [],
    type: TypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope);

  return {
    binding,
    dependencies: [typeServiceWithTransientScopeParameter],
    service:
      TypeServiceWithBindingWithTransientScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
