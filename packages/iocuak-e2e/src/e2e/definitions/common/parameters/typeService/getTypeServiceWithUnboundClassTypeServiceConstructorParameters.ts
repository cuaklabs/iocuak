import {
  BindingScope,
  BindingType,
  TypeBinding,
  injectable,
  inject,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

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

  const binding: TypeBinding = {
    bindingType: BindingType.type,
    id: Symbol(
      TypeServiceWithUnboundClassTypeServiceConstructorParameters.name,
    ),
    scope: BindingScope.singleton,
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
