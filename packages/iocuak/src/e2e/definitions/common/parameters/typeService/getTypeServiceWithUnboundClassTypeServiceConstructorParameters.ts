import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { inject } from '../../../../../classMetadata/decorators/inject';
import { getTypeServiceWithTypeServiceId } from './getTypeServiceWithTypeServiceId';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithUnboundClassTypeServiceConstructorParameters(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTypeServiceIdParameter: TypeServiceParameter =
    getTypeServiceWithTypeServiceId();

  class TypeServiceWithUnboundClassTypeServiceConstructorParameters {
    constructor(
      @inject(typeServiceWithTypeServiceIdParameter.binding.id)
      public typeServiceWithTypeServiceIdInstance: unknown,
    ) {
      constructorSpy(typeServiceWithTypeServiceIdInstance);
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(
      TypeServiceWithUnboundClassTypeServiceConstructorParameters.name,
    ),
    scope: BindingScopeApi.singleton,
    tags: [],
    type: TypeServiceWithUnboundClassTypeServiceConstructorParameters,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithUnboundClassTypeServiceConstructorParameters);

  return {
    binding,
    service: TypeServiceWithUnboundClassTypeServiceConstructorParameters,
    spy: constructorSpy,
  };
}
