import { ContainerModuleCreateInstancesTaskKind } from '../../../models/domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleTaskKindType } from '../../../models/domain/ContainerModuleTaskKindType';

export class ContainerModuleCreateInstancesTaskKindMocks {
  public static get any(): ContainerModuleCreateInstancesTaskKind {
    const fixture: ContainerModuleCreateInstancesTaskKind = {
      serviceIds: [],
      type: ContainerModuleTaskKindType.createInstances,
    };

    return fixture;
  }
}
