import { ContainerModuleCreateInstancesTaskKind } from './ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleLoadFromMetadataTaskKind } from './ContainerModuleLoadFromMetadataTaskKind';

export type ContainerModuleTaskKind =
  | ContainerModuleCreateInstancesTaskKind
  | ContainerModuleLoadFromMetadataTaskKind;
