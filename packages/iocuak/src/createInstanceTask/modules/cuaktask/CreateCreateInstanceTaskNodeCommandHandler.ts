import * as cuaktask from '@cuaklabs/cuaktask';

import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateCreateInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskNodeCommand';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateInstanceTaskNodeCommandHandler
  implements
    Handler<
      CreateCreateInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;

  constructor(
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    createCreateTypeBindingInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
  ) {
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
    this.#createCreateTypeBindingInstanceTaskGraphNodeCommandHandler =
      createCreateTypeBindingInstanceTaskGraphNodeCommandHandler;
  }

  public handle(
    createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskNodeCommand,
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
    createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskNodeCommand,
  ): createCreateInstanceTaskGraphNodeCommand is CreateCreateTypeBindingInstanceTaskNodeCommand {
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
