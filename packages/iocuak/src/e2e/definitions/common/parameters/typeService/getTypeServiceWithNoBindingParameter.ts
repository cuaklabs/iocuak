import sinon from 'sinon';

import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
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
    get binding(): TypeBindingApi {
      throw new Error(
        'Binding is not available. This type service has no binding',
      );
    },
    service: TypeServiceWithNoDependenciesParameter,
    spy: constructorSpy,
  };
}
