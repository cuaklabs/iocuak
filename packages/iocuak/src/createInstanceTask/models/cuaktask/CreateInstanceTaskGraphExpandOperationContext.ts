import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { TaskKind } from '../domain/TaskKind';

export interface CreateInstanceTaskGraphExpandOperationContext
  extends TaskGraphExpandOperationContext {
  serviceIdToRequestCreateInstanceTaskKindNode: Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  serviceIdToSingletonCreateInstanceTaskKindNode: Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
}
