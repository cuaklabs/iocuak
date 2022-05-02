import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { ContainerModuleBaseTaskKind } from './ContainerModuleBaseTaskKind';
import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleLoadFromMetadataTaskKind<
  TMetadata extends ContainerModuleMetadata = ContainerModuleMetadata,
> extends ContainerModuleBaseTaskKind<ContainerModuleTaskKindType.loadFromMetadata> {
  metadata: TMetadata;
}
