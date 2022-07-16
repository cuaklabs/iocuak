import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
  inject,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithRequestScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithRequestScope();

  class TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope {
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
      TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope.name,
    ),
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope);

  return {
    binding,
    dependencies: [typeServiceWithRequestScopeParameter],
    service: TypeServiceWithTwoDependenciesOfTheSameTypeWithRequestScope,
    spy: constructorSpy,
  };
}
