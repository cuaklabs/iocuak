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

export function getTypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();

  class TypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope {
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
      TypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope.name,
    ),
    scope: BindingScope.request,
    tags: [],
    type: TypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope);

  return {
    binding,
    dependencies: [typeServiceWithTransientScopeParameter],
    service:
      TypeServiceWithBindingWithRequestScopeAndDependenciesWithTransientScope,
    spy: constructorSpy,
  };
}
