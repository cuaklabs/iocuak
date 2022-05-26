import { Node, NodeDependenciesType, Task } from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { Handler } from '../../../common/modules/domain/Handler';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class CreateInstanceTaskGraphExpandCommandHandler
  implements Handler<CreateInstanceTaskGraphExpandCommand, void>
{
  readonly #bus: Handler<unknown, void | Promise<void>>;
  readonly #metadataService: MetadataService;

  constructor(
    bus: Handler<unknown, void | Promise<void>>,
    metadataService: MetadataService,
  ) {
    this.#bus = bus;
    this.#metadataService = metadataService;
  }

  public handle(
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand,
  ): void | Promise<void> {
    const taskKind: CreateInstanceTaskKind<Binding> =
      createInstanceTaskGraphExpandCommand.node.element.kind;

    if (this.#isTypeCreateInstanceTaskKind(taskKind)) {
      const getInstanteDependenciesNode: Node<
        GetInstanceDependenciesTask,
        Task<TaskKind>
      > = this.#buildGetInstanteDependenciesNode(taskKind);

      this.#expandNodeWithDependency(
        createInstanceTaskGraphExpandCommand,
        getInstanteDependenciesNode,
      );

      const getInstanceDependenciesTraphGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand =
        {
          context: createInstanceTaskGraphExpandCommand.context,
          node: getInstanteDependenciesNode,
          taskKindType: TaskKindType.getInstanceDependencies,
        };

      const result: void | Promise<void> = this.#bus.handle(
        getInstanceDependenciesTraphGraphExpandCommand,
      );

      return result;
    }
  }

  #buildGetInstanteDependenciesNode(
    taskKind: CreateInstanceTaskKind<TypeBinding>,
  ): Node<GetInstanceDependenciesTask, Task<TaskKind>> {
    const metadata: ClassMetadata = this.#metadataService.getClassMetadata(
      taskKind.binding.type,
    );

    const getInstanteDependenciesNode: Node<
      GetInstanceDependenciesTask,
      Task<TaskKind>
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

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }

  #expandNodeWithDependency(
    createInstanceTaskGraphExpandCommand: CreateInstanceTaskGraphExpandCommand,
    dependency: Node<Task<TaskKind>>,
  ): void {
    createInstanceTaskGraphExpandCommand.node.dependencies = {
      nodes: [dependency],
      type: NodeDependenciesType.and,
    };

    createInstanceTaskGraphExpandCommand.context.graph.nodes.push(dependency);
  }
}
