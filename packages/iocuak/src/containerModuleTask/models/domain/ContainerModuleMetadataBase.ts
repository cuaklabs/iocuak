import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';

export interface ContainerModuleMetadataBase {
  imports: ContainerModuleMetadata[];
  injects: ServiceId[];
}
