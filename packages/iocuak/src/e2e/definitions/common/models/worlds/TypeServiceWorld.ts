import { IWorld } from '@cucumber/cucumber';
import sinon from 'sinon';

import { Newable } from '../../../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';

export interface TypeServiceWorld extends IWorld {
  typeService: Newable;
  typeServiceBinding: TypeBindingApi;
  typeServiceSpy: sinon.SinonSpy;
}
