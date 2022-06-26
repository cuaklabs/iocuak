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
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceRootTaskKind } from '../../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { CreateTagInstancesRootTaskKind } from '../../models/domain/CreateTagInstancesRootTaskKind';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { addNodesToGraph } from '../../utils/addNodesToGraph';

export class CreateInstanceTaskGraphEngine
  implements cuaktask.TaskGraphEngine<TaskKind>
{
  readonly #bindingService: BindingService;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #metadataService: MetadataService;
  readonly #taskGraphExpandCommandHandler: Handler<
    TaskNodeExpandCommand,
    void | Promise<void>
  >;

  constructor(
    bindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    metadataService: MetadataService,
    taskGraphExpandCommandHandler: Handler<
      TaskNodeExpandCommand,
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
      case TaskKindType.createTagInstancesRoot:
        taskRootedGraph =
          this.#createFromCreateTagInstancesRootTaskKind(taskKind);
        break;
      default:
        throw new Error('Unexpected task kind');
    }

    return taskRootedGraph;
  }

  #buildCreateInstanceTaskNodeExpandOperationContext(
    requestId: symbol,
  ): CreateInstanceTaskNodeExpandOperationContext {
    return {
      requestId: requestId,
      serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
      serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
      serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
    };
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

    const rootedTaskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> =
      this.#createFromTask(
        createInstanceTask,
        (
          node: cuaktask.Node<cuaktask.Task<CreateInstanceTaskKind>>,
        ): CreateInstanceTaskNodeExpandCommand => ({
          context: this.#buildCreateInstanceTaskNodeExpandOperationContext(
            taskKind.requestId,
          ),
          node,
          taskKindType: TaskNodeExpandCommandType.createInstance,
        }),
      );

    return rootedTaskGraph;
  }

  #createFromCreateTagInstancesRootTaskKind(
    taskKind: CreateTagInstancesRootTaskKind,
  ): cuaktask.RootedGraph<cuaktask.Task<TaskKind>> {
    const createTagInstancesTaskKind: CreateTagInstancesTaskKind = {
      tag: taskKind.tag,
      type: TaskKindType.createTagInstances,
    };

    const createTagInstancesTask: CreateTagInstancesTask =
      new CreateTagInstancesTask(createTagInstancesTaskKind);

    const rootedTaskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> =
      this.#createFromTask(
        createTagInstancesTask,
        (
          node: cuaktask.Node<cuaktask.Task<CreateTagInstancesTaskKind>>,
        ): CreateTagInstancesTaskNodeExpandCommand => ({
          context: this.#buildCreateInstanceTaskNodeExpandOperationContext(
            taskKind.requestId,
          ),
          node,
          taskKindType: TaskNodeExpandCommandType.createTagInstances,
        }),
      );

    return rootedTaskGraph;
  }

  #createFromTask<TTaskKind extends TaskKind>(
    task: cuaktask.Task<TTaskKind>,
    nodeToCommand: (
      node: cuaktask.Node<cuaktask.Task<TTaskKind>>,
    ) => TaskNodeExpandCommand,
  ): cuaktask.RootedGraph<cuaktask.Task<TaskKind>> {
    const taskNode: cuaktask.Node<cuaktask.Task<TTaskKind>> = {
      dependencies: undefined,
      element: task,
    };

    const rootedTaskGraph: cuaktask.RootedGraph<cuaktask.Task<TaskKind>> = {
      nodes: new Set(),
      root: taskNode,
    };

    const taskNodeExpandCommand: TaskNodeExpandCommand =
      nodeToCommand(taskNode);

    const result: void | Promise<void> =
      this.#taskGraphExpandCommandHandler.handle(taskNodeExpandCommand);

    if (cuaktask.isPromiseLike(result)) {
      throw new Error('Expecting a syncronous result');
    }

    addNodesToGraph(rootedTaskGraph, taskNode);

    return rootedTaskGraph;
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding =
      this.#bindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }
}
