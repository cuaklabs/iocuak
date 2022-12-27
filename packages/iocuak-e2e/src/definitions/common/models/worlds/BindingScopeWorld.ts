import { IWorld } from '@cucumber/cucumber';

import { BindingScopeParameter } from '../../parameters/bindingScope/BindingScopeParameter';

export interface BindingScopeWorld extends IWorld {
  bindingScopeParameter: BindingScopeParameter;
}
