import sinon from 'sinon';

import { Newable } from '../../../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';

export interface TypeServiceParameter {
  bindingApi: TypeBindingApi;
  service: Newable;
  spy: sinon.SinonSpy;
}
