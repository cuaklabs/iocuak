import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';

export interface ContainerModuleMetadata<
  TModule extends ContainerModuleApi = ContainerModuleApi,
  TArgs extends unknown[] = unknown[],
> {
  factory: (...args: TArgs) => TModule | Promise<TModule>;
  imports: ContainerModuleMetadata<ContainerModuleApi>[];
  injects: ServiceId[];
}
