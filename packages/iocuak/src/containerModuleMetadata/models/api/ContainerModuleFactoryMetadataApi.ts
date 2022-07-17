import { ServiceId } from '@cuaklabs/iocuak-common';

import { ClassElementMetadataApi } from '../../../classMetadata/models/api/ClassElementMetadataApi';
import { ContainerModuleApi } from '../../../containerModule/models/api/ContainerModuleApi';
import { ContainerModuleMetadataBaseApi } from './ContainerModuleMetadataBaseApi';

export interface ContainerModuleFactoryMetadataApi<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBaseApi {
  factory: (...args: TArgs) => ContainerModuleApi | Promise<ContainerModuleApi>;
  injects?: (ServiceId | ClassElementMetadataApi)[];
}
