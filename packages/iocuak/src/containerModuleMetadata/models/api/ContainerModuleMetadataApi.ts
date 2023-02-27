import { Newable } from '@cuaklabs/iocuak-common';

import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from './ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from './ContainerModuleFactoryMetadataApi';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContainerModuleMetadataApi<TArgs extends unknown[] = any[]> =
  | ContainerModuleApi
  | ContainerModuleFactoryMetadataApi<TArgs>
  | ContainerModuleClassMetadataApi
  | Newable<ContainerModuleApi>;
