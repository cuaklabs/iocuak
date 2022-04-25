import { IWorld } from '@cucumber/cucumber';

import { TypeServiceParameter } from '../../parameters/typeService/TypeServiceParameter';

export interface TypeServiceWorld extends IWorld {
  typeServiceParameter: TypeServiceParameter;
}
