import {
  BindingScope,
  BindingType,
  inject,
  injectable,
  TypeBinding,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithTypeServiceId } from './getTypeServiceWithTypeServiceId';
import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithUnboundClassTypeServiceProperties(): TypeServiceParameter {
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

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(TypeServiceWithUnboundClassTypeServiceProperties.name),
    scope: BindingScope.singleton,
    tags: [],
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
