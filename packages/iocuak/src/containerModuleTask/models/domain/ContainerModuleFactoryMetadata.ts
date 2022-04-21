import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';

export interface ContainerModuleFactoryMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
}
