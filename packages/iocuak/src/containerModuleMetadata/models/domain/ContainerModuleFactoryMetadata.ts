import { ContainerModule } from '@cuaklabs/iocuak-core';
import { ClassElementMetadata } from '@cuaklabs/iocuak-models';

import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleFactoryMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.factory> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  injects: ClassElementMetadata[];
}
