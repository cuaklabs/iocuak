import { Newable } from '../../../common/models/domain/Newable';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from './ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from './ContainerModuleFactoryMetadataApi';

export type ContainerModuleMetadataApi<TArgs extends unknown[] = unknown[]> =
  | ContainerModuleApi
  | ContainerModuleFactoryMetadataApi<TArgs>
  | ContainerModuleClassMetadataApi
  | Newable<ContainerModuleApi>;
