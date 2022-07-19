import { ClassElementMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleFactoryMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.factory> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  injects: ClassElementMetadata[];
}
