import { ContainerModuleClassMetadataApi } from './ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from './ContainerModuleFactoryMetadataApi';

export type ContainerModuleMetadataApi<TArgs extends unknown[] = unknown[]> =
  | ContainerModuleFactoryMetadataApi<TArgs>
  | ContainerModuleClassMetadataApi;
