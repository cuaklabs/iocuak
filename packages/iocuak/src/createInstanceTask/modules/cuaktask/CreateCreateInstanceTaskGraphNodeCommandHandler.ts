import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingScope } from '../../../binding/models/domain/BindingScope';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateInstanceTaskGraphNodeCommandHandler
  implements
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
  ) {
    this.#createCreateRequestScopedInstanceTaskGraphNodeCommandHandler =
      createCreateRequestScopedInstanceTaskGraphNodeCommandHandler;
    this.#createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler =
      createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler;
    this.#createCreateTransientScopedInstanceTaskGraphNodeCommandHandler =
      createCreateTransientScopedInstanceTaskGraphNodeCommandHandler;
  }

  public handle(
    createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    let createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >;

    const scope: BindingScope =
      createCreateInstanceTaskGraphNodeCommand.context.taskKind.binding.scope;

    switch (scope) {
      case BindingScope.request:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateRequestScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateInstanceTaskGraphNodeCommand,
          );
        break;
      case BindingScope.singleton:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateInstanceTaskGraphNodeCommand,
          );
        break;
      case BindingScope.transient:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateTransientScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateInstanceTaskGraphNodeCommand,
          );
        break;
    }

    return createInstanceTaskKindGraphNodeDependency;
  }
}
