import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleBaseTaskKind } from './ContainerModuleBaseTaskKind';
import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleCreateInstancesTaskKind
  extends ContainerModuleBaseTaskKind<ContainerModuleTaskKindType.createInstances> {
  serviceIds: ServiceId[];
}
