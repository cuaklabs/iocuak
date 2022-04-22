import { Newable } from '../../../common/models/domain/Newable';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleClassMetadata
  extends ContainerModuleMetadataBase<ContainerModuleMetadataType.clazz> {
  module: Newable<ContainerModule>;
}
