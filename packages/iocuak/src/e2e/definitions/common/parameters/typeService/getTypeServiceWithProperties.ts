import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { getValueServiceParameter } from '../valueService/getValueServiceParameter';
import { ValueServiceParameter } from '../valueService/ValueServiceParameter';
import { getTypeServiceWithBindingWithRequestScope } from './getTypeServiceWithBindingWithRequestScope';
import { getTypeServiceWithBindingWithSingletonScope } from './getTypeServiceWithBindingWithSingletonScope';
import { getTypeServiceWithBindingWithTransientScope } from './getTypeServiceWithBindingWithTransientScope';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithProperties(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithRequestScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithRequestScope();
  const typeServiceWithSingletonScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithSingletonScope();
  const typeServiceWithTransientScopeParameter: TypeServiceParameter =
    getTypeServiceWithBindingWithTransientScope();
  const valueServiceParameter: ValueServiceParameter =
    getValueServiceParameter();

  class TypeServiceWithProperties {
    @inject(typeServiceWithRequestScopeParameter.binding.id)
    public typeServiceWithRequestScopeInstance: unknown;
    @inject(typeServiceWithSingletonScopeParameter.binding.id)
    public typeServiceWithSingletonScopeInstance: unknown;
    @inject(typeServiceWithTransientScopeParameter.binding.id)
    public typeServiceWithTransientScopeInstance: unknown;
    @inject(valueServiceParameter.binding.id)
    public valueService: unknown;

    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithProperties.name),
    scope: BindingScopeApi.singleton,
    tags: [],
    type: TypeServiceWithProperties,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithProperties);

  return {
    binding,
    dependencies: [
      typeServiceWithRequestScopeParameter,
      typeServiceWithSingletonScopeParameter,
      typeServiceWithTransientScopeParameter,
      valueServiceParameter,
    ],
    service: TypeServiceWithProperties,
    spy: constructorSpy,
  };
}
