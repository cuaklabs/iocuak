import sinon from 'sinon';

import { injectable } from '../../../../../binding/decorators/injectable';
import { BindingScopeApi } from '../../../../../binding/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../binding/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithTypeServiceId(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithTypeServiceId {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: TypeServiceWithTypeServiceId,
    scope: BindingScopeApi.singleton,
    tags: [],
    type: TypeServiceWithTypeServiceId,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(TypeServiceWithTypeServiceId);

  return {
    binding,
    service: TypeServiceWithTypeServiceId,
    spy: constructorSpy,
  };
}
