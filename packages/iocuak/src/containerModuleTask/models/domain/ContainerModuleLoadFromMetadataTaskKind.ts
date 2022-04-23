import { ContainerModuleBaseTaskKind } from './ContainerModuleBaseTaskKind';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleLoadFromMetadataTaskKind<
  TMetadata extends ContainerModuleMetadata = ContainerModuleMetadata,
> extends ContainerModuleBaseTaskKind<ContainerModuleTaskKindType.loadFromMetadata> {
  metadata: TMetadata;
}
