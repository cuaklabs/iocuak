import { Newable } from '@cuaklabs/iocuak-common';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleMetadataBaseApi } from './ContainerModuleMetadataBaseApi';

export interface ContainerModuleClassMetadataApi
  extends ContainerModuleMetadataBaseApi {
  module: Newable<ContainerModuleApi>;
}
