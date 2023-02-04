import { ContainerModuleMetadataId } from '@cuaklabs/iocuak-common';

import { ContainerModuleMetadataApi } from './ContainerModuleMetadataApi';

export interface ContainerModuleMetadataBaseApi {
  id?: ContainerModuleMetadataId;
  imports?: ContainerModuleMetadataApi[];
}
