import { Newable } from '../../../common/models/domain/Newable';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleMetadataBaseApi } from './ContainerModuleMetadataBaseApi';

export interface ContainerModuleClassMetadataApi
  extends ContainerModuleMetadataBaseApi {
  module: Newable<ContainerModuleApi>;
}
