import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleFactoryMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.factory> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  injects: ServiceId[];
}
