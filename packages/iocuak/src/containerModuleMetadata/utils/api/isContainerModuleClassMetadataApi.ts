import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleMetadataApi } from '../../models/api/ContainerModuleMetadataApi';

export function isContainerModuleClassMetadataApi<TArgs extends unknown[]>(
  value: ContainerModuleMetadataApi<TArgs>,
): value is ContainerModuleClassMetadataApi {
  return (
    typeof (value as ContainerModuleClassMetadataApi).module === 'function'
  );
}
