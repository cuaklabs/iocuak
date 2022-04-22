import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleMetadataBase<
  TType extends ContainerModuleMetadataType,
> {
  imports: ContainerModuleMetadata[];
  type: TType;
}
