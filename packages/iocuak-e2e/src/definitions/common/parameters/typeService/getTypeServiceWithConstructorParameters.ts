import {
  BindingScope,
  BindingType,
  inject,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getValueServiceParameter } from '../valueService/getValueServiceParameter';
import { ValueServiceParameter } from '../valueService/ValueServiceParameter';
import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithConstructorParameters(): TypeServiceParameter {
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithRequestScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithRequestScope();
  const typeServiceWithSingletonScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithSingletonScope();
  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();
  const valueServiceParameter: ValueServiceParameter =
    getValueServiceParameter();

  class TypeServiceWithConstructorParameters {
    constructor(
      @inject(typeServiceWithRequestScopeParameter.binding.id)
      public typeServiceWithRequestScopeInstance: unknown,
      @inject(typeServiceWithSingletonScopeParameter.binding.id)
      public typeServiceWithSingletonScopeInstance: unknown,
      @inject(typeServiceWithTransientScopeParameter.binding.id)
      public typeServiceWithTransientScopeInstance: unknown,
      @inject(valueServiceParameter.binding.id)
      public valueService: unknown,
    ) {
      constructorSpy(
        typeServiceWithRequestScopeInstance,
        typeServiceWithSingletonScopeInstance,
        typeServiceWithTransientScopeInstance,
        valueService,
      );
    }
  }

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithConstructorParameters.name),
    scope: BindingScope.singleton,
    tags: [],
    type: TypeServiceWithConstructorParameters,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithConstructorParameters);

  return {
    binding,
    dependencies: [
      typeServiceWithRequestScopeParameter,
      typeServiceWithSingletonScopeParameter,
      typeServiceWithTransientScopeParameter,
      valueServiceParameter,
    ],
    service: TypeServiceWithConstructorParameters,
    spy: constructorSpy,
  };
}
