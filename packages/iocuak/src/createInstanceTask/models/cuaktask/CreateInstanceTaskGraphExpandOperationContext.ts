import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { TaskGraphExpandOperationContext } from '../../../common/models/cuaktask/TaskGraphExpandOperationContext';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKind } from '../domain/TaskKind';

type TypeBindingCreateInstanceTaskKindGraphNode =
  cuaktask.TaskDependencyKindGraphNode<
    CreateInstanceTaskKind<TypeBinding>,
    TaskKind
  >;

export interface CreateInstanceTaskGraphExpandOperationContext
  extends TaskGraphExpandOperationContext {
  serviceIdToRequestCreateInstanceTaskKindNode: Map<
    ServiceId,
    TypeBindingCreateInstanceTaskKindGraphNode
  >;
  serviceIdToSingletonCreateInstanceTaskKindNode: Map<
    ServiceId,
    TypeBindingCreateInstanceTaskKindGraphNode
  >;
}
