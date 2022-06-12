import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceRootTaskKind } from '../../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskGraphEngine
  implements cuaktask.TaskGraphEngine<TaskKind>
{
  readonly #bindingService: BindingService;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #metadataService: MetadataService;
  readonly #taskGraphExpandCommandHandler: Handler<
    CreateInstanceTaskGraphExpandCommand,
    void | Promise<void>
  >;

  constructor(
    bindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
    taskGraphExpandCommandHandler: Handler<
      CreateInstanceTaskGraphExpandCommand,
      void | Promise<void>
    >,
  ) {
    this.#bindingService = bindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
    this.#metadataService = metadataService;
    this.#taskGraphExpandCommandHandler = taskGraphExpandCommandHandler;
  }

  public create(
    taskKind: TaskKind,
  ): cuaktask.RootedGraph<cuaktask.Task<TaskKind>> {
    let taskRootedGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>>;

    switch (taskKind.type) {
      case TaskKindType.createInstanceRoot:
        taskRootedGraph = this.#createFromCreateInstanceRootTaskKind(taskKind);
        break;
      default:
        throw new Error('Unexpected task kind');
    }

    return taskRootedGraph;
  }

  #createFromCreateInstanceRootTaskKind(
    taskKind: CreateInstanceRootTaskKind,
  ): cuaktask.RootedGraph<cuaktask.Task<TaskKind>> {
    const binding: Binding = this.#getBinding(taskKind.id);

    const createInstanceTaskKind: CreateInstanceTaskKind = {
      binding,
      requestId: taskKind.requestId,
      type: TaskKindType.createInstance,
    };

    const createInstanceTask: CreateInstanceTask = new CreateInstanceTask(
      createInstanceTaskKind,
      this.#containerRequestService,
      this.#containerSingletonService,
    );

    const createInstanceTaskNode: cuaktask.Node<
      cuaktask.Task<CreateInstanceTaskKind>
    > = {
      dependencies: undefined,
      element: createInstanceTask,
    };

    const rootedTaskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> = {
      nodes: new Set([createInstanceTaskNode]),
      root: createInstanceTaskNode,
    };

    const createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand =
      {
        context: {
          graph: rootedTaskGraph,
          serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
          serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
          serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
        },
        node: createInstanceTaskNode,
        taskKindType: TaskKindType.createInstance,
      };

    const result: void | Promise<void> =
      this.#taskGraphExpandCommandHandler.handle(
        createInstanceTaskGraphExpandCommand,
      );

    if (cuaktask.isPromiseLike(result)) {
      throw new Error('Expecting a syncronous result');
    }

    return rootedTaskGraph;
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding =
      this.#bindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }
}
