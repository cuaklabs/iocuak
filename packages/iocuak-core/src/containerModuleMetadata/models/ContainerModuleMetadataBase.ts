import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  id: ContainerModuleMetadataId;
  requires: ContainerModuleMetadataId[];
  type: TType;
}
