import { IWorld } from '@cucumber/cucumber';

import { Newable } from '../../../../../common/models/domain/Newable';
import { TypeBindingApi } from '../../../../../metadata/models/api/TypeBindingApi';

export interface TypeServiceWorld extends IWorld {
  typeService: Newable;
  typeServiceBinding: TypeBindingApi;
}
