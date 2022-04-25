import { IWorld } from '@cucumber/cucumber';

import { ValueServiceParameter } from '../../parameters/valueService/ValueServiceParameter';

export interface ValueServiceWorld extends IWorld {
  valueServiceParameter: ValueServiceParameter;
}
