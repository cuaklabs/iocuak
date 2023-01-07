import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  id: ContainerModuleMetadataId | undefined;
  imports: ContainerModuleMetadata[];
  requires: ContainerModuleMetadataId[];
  type: TType;
}
