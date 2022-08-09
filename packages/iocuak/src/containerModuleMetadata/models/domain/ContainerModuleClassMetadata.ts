import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService } from '@cuaklabs/iocuak-core';

import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleClassMetadata<TModule = unknown>
  extends ContainerModuleMetadataBase<ContainerModuleMetadataType.clazz> {
  loader: (module: TModule, containerBindingService: BindingService) => void;
  moduleType: Newable<TModule>;
}
