import { Newable } from '../../../common/models/domain/Newable';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleClassMetadata<TModule = unknown>
  extends ContainerModuleMetadataBase<ContainerModuleMetadataType.clazz> {
  loader: (
    module: TModule,
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ) => void;
  moduleType: Newable<TModule>;
}
