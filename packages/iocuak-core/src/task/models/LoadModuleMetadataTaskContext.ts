import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { CreateInstanceTaskContext } from './CreateInstanceTaskContext';

export interface LoadModuleMetadataTaskContext
  extends CreateInstanceTaskContext {
  readonly containerModuleMetadataIdToContainerModuleMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata
  >;
  readonly containerModulesLoadedSet: Set<ContainerModuleMetadataId>;
}
