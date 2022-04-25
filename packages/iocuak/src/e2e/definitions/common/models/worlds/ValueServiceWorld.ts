import { IWorld } from '@cucumber/cucumber';

import { ValueServiceParameter } from '../../parameters/ValueServiceParameter';

export interface ValueServiceWorld extends IWorld {
  valueServiceParameter: ValueServiceParameter;
}
