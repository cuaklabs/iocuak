import sinon from 'sinon';

import { inject } from '../../../../../classMetadata/decorators/inject';
import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
import { getTypeServiceWithTypeServiceId } from './getTypeServiceWithTypeServiceId';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithUnboundClassTypeServiceProperties(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  const typeServiceWithTypeServiceIdParameter: TypeServiceParameter =
    getTypeServiceWithTypeServiceId();

  class TypeServiceWithUnboundClassTypeServiceProperties {
    @inject(typeServiceWithTypeServiceIdParameter.binding.id)
    public typeServiceWithTypeServiceIdInstance: unknown;

    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(TypeServiceWithUnboundClassTypeServiceProperties.name),
    scope: BindingScopeApi.singleton,
    type: TypeServiceWithUnboundClassTypeServiceProperties,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithUnboundClassTypeServiceProperties);

  return {
    binding,
    service: TypeServiceWithUnboundClassTypeServiceProperties,
    spy: constructorSpy,
  };
}
