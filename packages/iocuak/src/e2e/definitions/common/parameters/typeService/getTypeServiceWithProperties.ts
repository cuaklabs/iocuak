import sinon from 'sinon';

import { inject } from '../../../../../classMetadata/decorators/inject';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
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
