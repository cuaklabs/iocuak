import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { CreateInstanceTaskContext } from '../../createInstanceTask/models/CreateInstanceTaskContext';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';

export interface LoadModuleMetadataTaskContext
  extends CreateInstanceTaskContext {
  readonly containerModuleMetadataIdToContainerModuleMetadataMap: Map<
    ContainerModuleMetadataId,
    ContainerModuleMetadata
  >;
  readonly containerModulesLoadedSet: Set<ContainerModuleMetadataId>;
}
