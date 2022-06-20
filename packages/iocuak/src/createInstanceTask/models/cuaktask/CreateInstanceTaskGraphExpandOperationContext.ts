import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { TaskKind } from '../domain/TaskKind';
import { TaskGraphExpandOperationContext } from './TaskGraphExpandOperationContext';

export interface CreateInstanceTaskGraphExpandOperationContext
  extends TaskGraphExpandOperationContext {
  requestId: symbol;
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
