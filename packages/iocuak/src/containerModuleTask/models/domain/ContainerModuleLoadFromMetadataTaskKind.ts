import { ContainerModuleMetadataApi } from '../api/ContainerModuleMetadataApi';
import { ContainerModuleBaseTaskKind } from './ContainerModuleBaseTaskKind';
import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleLoadFromMetadataTaskKind
  extends ContainerModuleBaseTaskKind<ContainerModuleTaskKindType.loadFromMetadata> {
  metadata: ContainerModuleMetadataApi;
}
