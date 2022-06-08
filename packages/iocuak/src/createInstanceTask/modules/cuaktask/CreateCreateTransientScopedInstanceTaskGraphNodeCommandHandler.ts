import * as cuaktask from '@cuaklabs/cuaktask';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { CreateInstanceTaskGraphFromTaskKindExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphFromTaskKindExpandOperationContext';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateCreateTransientScopedInstanceTaskGraphNodeCommandHandler
  implements
    Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >
{
  readonly #bus: Handler<unknown, void | Promise<void>>;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;

  constructor(
    bus: Handler<unknown, void | Promise<void>>,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
  ) {
    this.#bus = bus;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
  }

  public handle(
    createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand: CreateCreateInstanceTaskGraphNodeCommand,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>> {
    const createInstanceTaskKindGraphNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    > = this.#createNewCreateInstanceTaskKindGraphNode(
      createInstanceTaskGraphFromTypeBindingTaskKindExpandCommand.context,
    );

    return createInstanceTaskKindGraphNode;
  }

  #createNewCreateInstanceTaskGraphExpandCommand(
    context: CreateInstanceTaskGraphFromTaskKindExpandOperationContext<
      CreateInstanceTaskKind<TypeBinding>
    >,
    createInstanceTaskKindGraphNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    >,
  ): CreateInstanceTaskGraphExpandCommand {
    const createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskGraphExpandOperationContext =
      {
        graph: context.graph,
        serviceIdAncestorList: context.serviceIdAncestorList,
        serviceIdToRequestCreateInstanceTaskKindNode:
          context.serviceIdToRequestCreateInstanceTaskKindNode,
        serviceIdToSingletonCreateInstanceTaskKindNode:
          context.serviceIdToSingletonCreateInstanceTaskKindNode,
      };

    const createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand =
      {
        context: createInstanceTaskGraphExpandOperationContext,
        node: createInstanceTaskKindGraphNode,
        taskKindType: TaskKindType.createInstance,
      };

    return createInstanceTaskGraphExpandCommand;
  }

  #createNewCreateInstanceTaskKindGraphNode(
    context: CreateInstanceTaskGraphFromTaskKindExpandOperationContext<
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

    const createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand =
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
