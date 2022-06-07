import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { TaskKind } from '../../models/domain/TaskKind';
import { BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler } from './BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler';

export class CreateCreateSingletonScopedInstanceTaskGraphNodeCommandHandler extends BaseCreateCreateCachedScopedInstanceTaskGraphNodeCommandHandler {
  protected _getServiceIdToNodeDependencyMap(
    context: CreateInstanceTaskGraphExpandOperationContext,
  ): Map<ServiceId, cuaktask.NodeDependency<cuaktask.Task<TaskKind>>> {
    return context.serviceIdToSingletonCreateInstanceTaskKindNode;
  }
}
