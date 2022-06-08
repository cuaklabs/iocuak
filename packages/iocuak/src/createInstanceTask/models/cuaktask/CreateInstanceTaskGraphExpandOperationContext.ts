import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { TaskKind } from '../domain/TaskKind';

export interface CreateInstanceTaskGraphExpandOperationContext
  extends TaskGraphExpandOperationContext {
  serviceIdAncestorList: ReadOnlyLinkedList<ServiceId>;
  serviceIdToRequestCreateInstanceTaskKindNode: Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  serviceIdToSingletonCreateInstanceTaskKindNode: Map<
    ServiceId,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
}
