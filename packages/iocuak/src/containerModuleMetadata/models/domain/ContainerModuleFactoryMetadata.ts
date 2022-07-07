import { ClassElementMetadata } from '../../../classMetadata/models/domain/ClassElementMetadata';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleFactoryMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.factory> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  injects: ClassElementMetadata[];
}
