import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';

export interface ContainerModuleMetadataApi<
  TModule extends ContainerModuleApi = ContainerModuleApi,
  TArgs extends unknown[] = unknown[],
> {
  factory: (...args: TArgs) => TModule | Promise<TModule>;
  imports: ContainerModuleMetadataApi<ContainerModuleApi>[];
  injects: ServiceId[];
}
