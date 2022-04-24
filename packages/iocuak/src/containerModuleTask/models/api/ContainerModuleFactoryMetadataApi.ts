import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleMetadataBaseApi } from './ContainerModuleMetadataBaseApi';

export interface ContainerModuleFactoryMetadataApi<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBaseApi {
  factory: (...args: TArgs) => ContainerModuleApi | Promise<ContainerModuleApi>;
  injects: ServiceId[];
}
