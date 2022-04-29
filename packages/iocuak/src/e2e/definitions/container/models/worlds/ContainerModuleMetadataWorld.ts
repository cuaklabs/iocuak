import { IWorld } from '@cucumber/cucumber';

import { ContainerModuleMetadataParameter } from '../../parameters/containerModuleMetadata/ContainerModuleMetadataParameter';

export interface ContainerModuleMetadataWorld extends IWorld {
  containerModuleMetadataParameter: ContainerModuleMetadataParameter;
}
