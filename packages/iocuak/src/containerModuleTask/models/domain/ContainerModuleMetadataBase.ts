import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  imports: ContainerModuleMetadata[];
  injects: ServiceId[];
  type: TType;
}
