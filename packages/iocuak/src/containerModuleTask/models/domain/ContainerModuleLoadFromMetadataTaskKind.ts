import { ContainerModuleBaseTaskKind } from './ContainerModuleBaseTaskKind';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleLoadFromMetadataTaskKind
  extends ContainerModuleBaseTaskKind<ContainerModuleTaskKindType.loadFromMetadata> {
  metadata: ContainerModuleMetadata;
}
