import * as cuaktask from '@cuaklabs/cuaktask';

import { Handler } from '../../../common/modules/domain/Handler';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
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
  readonly #createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskGraphExpandOperationContext;

  constructor(
    bus: Handler<TaskGraphExpandCommand, void | Promise<void>>,
    createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskGraphExpandOperationContext,
    public readonly element: cuaktask.Task<CreateInstanceTaskKind>,
  ) {
    super(bus);

    this.#createInstanceTaskGraphExpandOperationContext =
      createInstanceTaskGraphExpandOperationContext;
  }

  protected buildTaskGraphExpandCommand(): TaskGraphExpandCommand {
    return {
      context: this.#createInstanceTaskGraphExpandOperationContext,
      node: this,
      taskKindType: TaskGraphExpandCommandType.createInstance,
    };
  }
}
