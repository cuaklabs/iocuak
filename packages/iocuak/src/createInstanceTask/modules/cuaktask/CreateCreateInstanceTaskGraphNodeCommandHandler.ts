import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateInstanceTaskGraphNodeCommandHandler
  implements
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
  ) {
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
    this.#createCreateTypeBindingInstanceTaskGraphNodeCommandHandler =
      createCreateTypeBindingInstanceTaskGraphNodeCommandHandler;
  }

  public handle(
    createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    let createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >;

    if (
      this.#isCreateCreateTypeBindingInstanceTaskGraphNodeCommand(
        createCreateInstanceTaskGraphNodeCommand,
      )
    ) {
      createInstanceTaskKindGraphNodeDependency =
        this.#createCreateTypeBindingInstanceTaskGraphNodeCommandHandler.handle(
          createCreateInstanceTaskGraphNodeCommand,
        );
    } else {
      const createInstanceTaskKind: CreateInstanceTaskKind =
        createCreateInstanceTaskGraphNodeCommand.context.taskKind;

      createInstanceTaskKindGraphNodeDependency = {
        dependencies: undefined,
        element: new CreateInstanceTask(
          createInstanceTaskKind,
          this.#containerRequestService,
          this.#containerSingletonService,
        ),
      };
    }

    return createInstanceTaskKindGraphNodeDependency;
  }

  #isCreateCreateTypeBindingInstanceTaskGraphNodeCommand(
    createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand,
  ): createCreateInstanceTaskGraphNodeCommand is CreateCreateTypeBindingInstanceTaskGraphNodeCommand {
    return this.#isTypeCreateInstanceTaskKind(
      createCreateInstanceTaskGraphNodeCommand.context.taskKind,
    );
  }

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }
}
