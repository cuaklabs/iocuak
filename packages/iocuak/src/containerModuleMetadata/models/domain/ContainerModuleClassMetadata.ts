import { BindingService } from '../../../binding/services/domain/BindingService';
import { Newable } from '../../../common/models/domain/Newable';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleClassMetadata<TModule = unknown>
  extends ContainerModuleMetadataBase<ContainerModuleMetadataType.clazz> {
  loader: (
    module: TModule,
    containerBindingService: BindingService,
    metadataService: MetadataService,
  ) => void;
  moduleType: Newable<TModule>;
}
