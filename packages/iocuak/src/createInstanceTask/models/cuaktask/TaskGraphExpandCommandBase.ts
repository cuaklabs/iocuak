import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommandType } from './TaskGraphExpandCommandType';
import { TaskGraphExpandOperationContext } from './TaskGraphExpandOperationContext';

export interface TaskGraphExpandCommandBase<
  TContext extends TaskGraphExpandOperationContext,
  TTaskKindType extends TaskGraphExpandCommandType,
  TNodeTask extends cuaktask.Task<unknown>,
> {
  context: TContext;
  node: cuaktask.Node<TNodeTask, cuaktask.Task<unknown>>;
  taskKindType: TTaskKindType;
}
