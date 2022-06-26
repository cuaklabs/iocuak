import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { TaskKind } from '../../models/domain/TaskKind';
import { BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler } from './BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler';

export class CreateCreateRequestScopedInstanceTaskNodeCommandHandler extends BaseCreateCreateCachedScopedInstanceTaskNodeCommandHandler {
  protected _getServiceIdToNodeDependencyMap(
    context: CreateInstanceTaskNodeExpandOperationContext,
  ): Map<ServiceId, cuaktask.NodeDependency<cuaktask.Task<TaskKind>>> {
    return context.serviceIdToRequestCreateInstanceTaskKindNode;
  }
}
