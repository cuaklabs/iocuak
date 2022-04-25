import { IWorld } from '@cucumber/cucumber';

import { ValueBindingApi } from '../../../../../metadata/models/api/ValueBindingApi';

export interface ValueServiceWorld extends IWorld {
  valueService: unknown;
  valueServiceBinding: ValueBindingApi;
}
