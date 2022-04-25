import sinon from 'sinon';

import { Newable } from '../../../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';
import { ValueServiceParameter } from '../ValueServiceParameter';

export interface TypeServiceParameter {
  bindingApi: TypeBindingApi;
  dependencies?: (TypeServiceParameter | ValueServiceParameter)[];
  service: Newable;
  spy: sinon.SinonSpy;
}
