import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingScope } from '../../../binding/models/domain/BindingScope';
import { Handler } from '../../../common/modules/domain/Handler';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommand';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateTypeBindingInstanceTaskGraphNodeCommandHandler
  implements
    Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    createCreateRequestScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateSingletonScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    createCreateTransientScopedInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
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
    createCreateTypeBindingInstanceTaskGraphNodeCommand: CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
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
