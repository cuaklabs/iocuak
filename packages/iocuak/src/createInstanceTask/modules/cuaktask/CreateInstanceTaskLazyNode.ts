import * as cuaktask from '@cuaklabs/cuaktask';

import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { BaseCreateInstanceTaskLazyNode } from './BaseCreateInstanceTaskLazyNode';

export class CreateInstanceTaskLazyNode
  extends BaseCreateInstanceTaskLazyNode
  implements
    cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>,
      cuaktask.Task<unknown>
    >
{
  readonly #createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskNodeExpandOperationContext;

  constructor(
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskNodeExpandOperationContext,
    public readonly element: cuaktask.Task<CreateInstanceTaskKind>,
  ) {
    super(bus);

    this.#createInstanceTaskGraphExpandOperationContext =
      createInstanceTaskGraphExpandOperationContext;
  }

  protected buildTaskGraphExpandCommand(): TaskNodeExpandCommand {
    return {
      context: this.#createInstanceTaskGraphExpandOperationContext,
      node: this,
      taskKindType: TaskNodeExpandCommandType.createInstance,
    };
  }
}
