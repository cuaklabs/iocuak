import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskGraphExpandCommandHandler
  implements Handler<CreateInstanceTaskGraphExpandCommand, void>
{
  readonly #bus: Handler<
    TaskGraphExpandCommand<
      CreateInstanceTaskGraphExpandOperationContext,
      TaskKindType,
      cuaktask.Task<unknown>
    >,
    void | Promise<void>
  >;
  readonly #metadataService: MetadataService;

  constructor(
    bus: Handler<
      TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >,
      void | Promise<void>
    >,
    metadataService: MetadataService,
  ) {
    this.#bus = bus;
    this.#metadataService = metadataService;
  }

  public handle(
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand,
  ): void {
    const taskKind: CreateInstanceTaskKind<Binding> =
      createInstanceTaskGraphExpandCommand.node.element.kind;

    if (this.#isTypeCreateInstanceTaskKind(taskKind)) {
      this.#checkCircularDependencies(
        createInstanceTaskGraphExpandCommand.context.serviceIdAncestorList,
        taskKind.binding.id,
      );

      const getInstanteDependenciesNode: cuaktask.Node<
        GetInstanceDependenciesTask,
        cuaktask.Task<TaskKind>
      > = this.#buildGetInstanteDependenciesNode(taskKind);

      this.#expandNodeWithDependency(
        createInstanceTaskGraphExpandCommand,
        getInstanteDependenciesNode,
      );

      const getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand =
        this.#buildGetInstanceDependenciesTaskGraphExpandCommand(
          createInstanceTaskGraphExpandCommand.context,
          taskKind,
          getInstanteDependenciesNode,
        );

      const result: void | Promise<void> = this.#bus.handle(
        getInstanceDependenciesTaskGraphExpandCommand,
      );

      if (cuaktask.isPromiseLike(result)) {
        throw new Error('Expecting a syncronous result');
      }
    }
  }

  #buildGetInstanteDependenciesNode(
    taskKind: CreateInstanceTaskKind<TypeBinding>,
  ): cuaktask.Node<GetInstanceDependenciesTask, cuaktask.Task<TaskKind>> {
    const metadata: ClassMetadata = this.#metadataService.getClassMetadata(
      taskKind.binding.type,
    );

    const getInstanteDependenciesNode: cuaktask.Node<
      GetInstanceDependenciesTask,
      cuaktask.Task<TaskKind>
    > = {
      dependencies: undefined,
      element: new GetInstanceDependenciesTask({
        id: taskKind.binding.id,
        metadata: metadata,
        requestId: taskKind.requestId,
        type: TaskKindType.getInstanceDependencies,
      }),
    };

    return getInstanteDependenciesNode;
  }

  #buildGetInstanceDependenciesTaskGraphExpandCommand(
    context: CreateInstanceTaskGraphExpandOperationContext,
    taskKind: CreateInstanceTaskKind<Binding>,
    getInstanteDependenciesNode: cuaktask.Node<
      GetInstanceDependenciesTask,
      cuaktask.Task<TaskKind>
    >,
  ): GetInstanceDependenciesTaskGraphExpandCommand {
    const createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskGraphExpandOperationContext =
      {
        graph: context.graph,
        serviceIdAncestorList: context.serviceIdAncestorList.concat(
          taskKind.binding.id,
        ),
        serviceIdToRequestCreateInstanceTaskKindNode:
          context.serviceIdToRequestCreateInstanceTaskKindNode,
        serviceIdToSingletonCreateInstanceTaskKindNode:
          context.serviceIdToSingletonCreateInstanceTaskKindNode,
      };

    const getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand =
      {
        context: createInstanceTaskGraphExpandOperationContext,
        node: getInstanteDependenciesNode,
        taskKindType: TaskKindType.getInstanceDependencies,
      };

    return getInstanceDependenciesTaskGraphExpandCommand;
  }

  #checkCircularDependencies(
    serviceIdAncestorList: ReadOnlyLinkedList<ServiceId>,
    serviceId: ServiceId,
  ): void {
    if (
      serviceIdAncestorList.includes(
        (serviceId: ServiceId) => serviceId === serviceId,
      )
    ) {
      const serviceIdTrace: string = [...serviceIdAncestorList]
        .map(stringifyServiceId)
        .join(',\n');
      throw new Error(
        `Circular dependency found related to ${stringifyServiceId(serviceId)}!
Trace:

${serviceIdTrace}`,
      );
    }
  }

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }

  #expandNodeWithDependency(
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand,
    dependency: cuaktask.Node<cuaktask.Task<TaskKind>>,
  ): void {
    createInstanceTaskGraphExpandCommand.node.dependencies = {
      nodes: [dependency],
      type: cuaktask.NodeDependenciesType.and,
    };

    createInstanceTaskGraphExpandCommand.context.graph.nodes.add(dependency);
  }
}
