import { IWorld } from '@cucumber/cucumber';

import { ContainerModuleParameter } from '../../parameters/containerModule/ContainerModuleParameter';

export interface ContainerModuleWorld extends IWorld {
  containerModuleParameter: ContainerModuleParameter;
}
