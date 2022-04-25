import sinon from 'sinon';

import { injectable } from '../../../../../metadata/decorators/injectable';
import { BindingScopeApi } from '../../../../../metadata/models/api/BindingScopeApi';
import { BindingTypeApi } from '../../../../../metadata/models/api/BindingTypeApi';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithBindingWithRequestScope(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class Foo {
    constructor() {
      constructorSpy();
    }
  }

  const binding: TypeBindingApi = {
    bindingType: BindingTypeApi.type,
    id: Symbol(Foo.name),
    scope: BindingScopeApi.singleton,
    type: Foo,
  };

  injectable({
    id: binding.id,
    scope: binding.scope,
  })(Foo);

  return {
    binding,
    service: Foo,
    spy: constructorSpy,
  };
}
