import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateInstanceTaskNodeFromTaskKindExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeFromTaskKindExpandOperationContext';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';

export class CreateCreateTransientScopedInstanceTaskNodeCommandHandler
  implements
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #bus: Handler<TaskNodeExpandCommand, void | Promise<void>>;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;

  constructor(
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    this.#bus = bus;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  public handle(
    createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateTypeBindingInstanceTaskNodeCommand,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>> {
    const createInstanceTaskKindGraphNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    > = this.#createNewCreateInstanceTaskKindGraphNode(
      createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand.context,
    );

    return createInstanceTaskKindGraphNode;
  }

  #createNewCreateInstanceTaskGraphExpandCommand(
    context: CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
      CreateInstanceTaskKind<TypeBinding>
    >,
    createInstanceTaskKindGraphNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    >,
  ): CreateInstanceTaskNodeExpandCommand {
    const createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand =
      {
        context,
        node: createInstanceTaskKindGraphNode,
        taskKindType: TaskNodeExpandCommandType.createInstance,
      };

    return createInstanceTaskGraphExpandCommand;
  }

  #createNewCreateInstanceTaskKindGraphNode(
    context: CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
      CreateInstanceTaskKind<TypeBinding>
    >,
  ): cuaktask.Node<cuaktask.Task<CreateInstanceTaskKind>> {
    const createInstanceTaskKindGraphNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    > = {
      dependencies: undefined,
      element: new CreateInstanceTask(
        context.taskKind,
        this.#containerRequestService,
        this.#containerSingletonService,
      ),
    };

    const createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand =
      this.#createNewCreateInstanceTaskGraphExpandCommand(
        context,
        createInstanceTaskKindGraphNode,
      );

    const result: void | Promise<void> = this.#bus.handle(
      createInstanceTaskGraphExpandCommand,
    );

    if (cuaktask.isPromiseLike(result)) {
      throw new Error('Expected syncronous flow');
    }

    return createInstanceTaskKindGraphNode;
  }
}
