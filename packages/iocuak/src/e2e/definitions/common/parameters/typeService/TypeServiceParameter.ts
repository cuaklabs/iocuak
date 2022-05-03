import sinon from 'sinon';

import { TypeBindingApi } from '../../../../../binding/models/api/TypeBindingApi';
import { Newable } from '../../../../../common/models/domain/Newable';
import { ValueServiceParameter } from '../valueService/ValueServiceParameter';

export interface TypeServiceParameter {
  binding: TypeBindingApi;
  dependencies?: (TypeServiceParameter | ValueServiceParameter)[];
  service: Newable;
  spy: sinon.SinonSpy;
}
