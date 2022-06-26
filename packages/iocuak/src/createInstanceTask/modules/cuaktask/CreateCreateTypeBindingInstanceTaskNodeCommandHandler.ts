import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingScope } from '../../../binding/models/domain/BindingScope';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateTypeBindingInstanceTaskNodeCommandHandler
  implements
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
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
    createCreateTypeBindingInstanceTaskGraphNodeCommand: CreateCreateTypeBindingInstanceTaskNodeCommand,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    let createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >;

    const scope: BindingScope =
      createCreateTypeBindingInstanceTaskGraphNodeCommand.context.taskKind
        .binding.scope;

    switch (scope) {
      case BindingScope.request:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateRequestScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateTypeBindingInstanceTaskGraphNodeCommand,
          );
        break;
      case BindingScope.singleton:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateTypeBindingInstanceTaskGraphNodeCommand,
          );
        break;
      case BindingScope.transient:
        createInstanceTaskKindGraphNodeDependency =
          this.#createCreateTransientScopedInstanceTaskGraphNodeCommandHandler.handle(
            createCreateTypeBindingInstanceTaskGraphNodeCommand,
          );
        break;
    }

    return createInstanceTaskKindGraphNodeDependency;
  }
}
