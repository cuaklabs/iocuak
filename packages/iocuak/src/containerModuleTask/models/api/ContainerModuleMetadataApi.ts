import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleApi } from '../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleMetadataBaseApi } from './ContainerModuleMetadataBaseApi';

export interface ContainerModuleMetadataApi<
  TModule extends ContainerModuleApi = ContainerModuleApi,
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBaseApi {
  factory: (...args: TArgs) => TModule | Promise<TModule>;
  injects: ServiceId[];
}
