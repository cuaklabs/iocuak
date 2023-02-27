import { ClassElementMetadata } from '@cuaklabs/iocuak-models';

import { ContainerModule } from '../../containerModule/models/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleFactoryMetadata<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends unknown[] = any[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.factory> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  injects: ClassElementMetadata[];
}
