import { IWorld } from '@cucumber/cucumber';

import { ContainerModuleMetadaParameter } from '../../parameters/containerModuleMetadata/ContainerModuleMetadaParameter';

export interface ContainerModuleMetadataWorld extends IWorld {
  containerModuleMetadaParameter: ContainerModuleMetadaParameter;
}
