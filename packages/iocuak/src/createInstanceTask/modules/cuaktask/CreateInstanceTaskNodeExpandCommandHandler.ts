import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ReadOnlyLinkedList } from '../../../list/models/domain/ReadOnlyLinkedList';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { stringifyServiceId } from '../../../utils/stringifyServiceId';
import { CreateInstanceTaskNodeExpandCommand } from '../../models/cuaktask/CreateInstanceTaskNodeExpandCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskNodeExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskNodeExpandCommandHandler
  implements Handler<CreateInstanceTaskNodeExpandCommand, void>
{
  readonly #bus: Handler<TaskNodeExpandCommand, void | Promise<void>>;
  readonly #metadataService: MetadataService;

  constructor(
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    metadataService: MetadataService,
  ) {
    this.#bus = bus;
    this.#metadataService = metadataService;
  }

  public handle(
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand,
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

      const getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskNodeExpandCommand =
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
        type: TaskKindType.getInstanceDependencies,
      }),
    };

    return getInstanteDependenciesNode;
  }

  #buildGetInstanceDependenciesTaskGraphExpandCommand(
    context: CreateInstanceTaskNodeExpandOperationContext,
    taskKind: CreateInstanceTaskKind<Binding>,
    getInstanteDependenciesNode: cuaktask.Node<
      GetInstanceDependenciesTask,
      cuaktask.Task<TaskKind>
    >,
  ): GetInstanceDependenciesTaskNodeExpandCommand {
    const createInstanceTaskGraphExpandOperationContext: CreateInstanceTaskNodeExpandOperationContext =
      {
        requestId: context.requestId,
        serviceIdAncestorList: context.serviceIdAncestorList.concat(
          taskKind.binding.id,
        ),
        serviceIdToRequestCreateInstanceTaskKindNode:
          context.serviceIdToRequestCreateInstanceTaskKindNode,
        serviceIdToSingletonCreateInstanceTaskKindNode:
          context.serviceIdToSingletonCreateInstanceTaskKindNode,
      };

    const getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskNodeExpandCommand =
      {
        context: createInstanceTaskGraphExpandOperationContext,
        node: getInstanteDependenciesNode,
        taskKindType: TaskNodeExpandCommandType.getInstanceDependencies,
      };

    return getInstanceDependenciesTaskGraphExpandCommand;
  }

  #checkCircularDependencies(
    serviceIdAncestorList: ReadOnlyLinkedList<ServiceId>,
    serviceId: ServiceId,
  ): void {
    if (
      serviceIdAncestorList.includes(
        (listServiceId: ServiceId) => listServiceId === serviceId,
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
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskNodeExpandCommand,
    dependency: cuaktask.Node<cuaktask.Task<TaskKind>>,
  ): void {
    createInstanceTaskGraphExpandCommand.node.dependencies = {
      nodes: [dependency],
      type: cuaktask.NodeDependenciesType.and,
    };
  }
}
