import { TypeBinding } from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from './TypeServiceParameter';

export function getTypeServiceWithNoBinding(): TypeServiceParameter {
  // eslint-disable-next-line import/no-named-as-default-member
  const constructorSpy: sinon.SinonSpy = sinon.spy();

  class TypeServiceWithNoDependenciesParameter {
    constructor() {
      constructorSpy();
    }
  }

  return {
    get binding(): TypeBinding {
      throw new Error(
        'Binding is not available. This type service has no binding',
      );
    },
    service: TypeServiceWithNoDependenciesParameter,
    spy: constructorSpy,
  };
}
