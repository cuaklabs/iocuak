import { Newable } from '../../../common/models/domain/Newable';
import { ContainerModuleMetadata } from './ContainerModuleMetadata';
import { ContainerModuleMetadataBase } from './ContainerModuleMetadataBase';
import { ContainerModuleMetadataType } from './ContainerModuleMetadataType';

export interface ContainerModuleClassMetadata<
  TArgs extends unknown[] = unknown[],
> extends ContainerModuleMetadataBase<ContainerModuleMetadataType.clazz> {
  module: Newable<ContainerModuleMetadata<TArgs>>;
}
