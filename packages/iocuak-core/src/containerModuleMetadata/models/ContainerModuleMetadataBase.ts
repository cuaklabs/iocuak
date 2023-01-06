import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  imports: ContainerModuleMetadata[];
  requires: ContainerModuleMetadataId[];
  type: TType;
}
