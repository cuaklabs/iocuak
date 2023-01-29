import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  id: ContainerModuleMetadataId;
  imports: ContainerModuleMetadata[];
  requires: ContainerModuleMetadataId[];
  type: TType;
}
