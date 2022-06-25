import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassElementMetadata } from '../../../classMetadata/models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../../classMetadata/models/domain/ClassElementMetadataType';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskGraphExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskGraphExpandCommand';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { addNodesToGraph } from '../../utils/addNodesToGraph';

export class GetInstanceDependenciesTaskGraphExpandCommandHandler
  implements Handler<GetInstanceDependenciesTaskGraphExpandCommand, void>
{
  readonly #bindingService: BindingService;
  readonly #bus: Handler<TaskGraphExpandCommand, void | Promise<void>>;
  readonly #createCreateInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #metadataService: MetadataService;

  constructor(
    bindingService: BindingService,
    bus: Handler<TaskGraphExpandCommand, void | Promise<void>>,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    metadataService: MetadataService,
  ) {
    this.#bindingService = bindingService;
    this.#bus = bus;
    this.#createCreateInstanceTaskGraphNodeCommandHandler =
      createCreateInstanceTaskGraphNodeCommandHandler;
    this.#metadataService = metadataService;
  }

  public handle(
    getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskGraphExpandCommand,
  ): void {
    const taskKind: TaskKind =
      getInstanceDependenciesTaskGraphExpandCommand.node.element.kind;

    const classElementsMetadata: ClassElementMetadata[] =
      this.#getInstanceDependenciesTaskKindDependenciesClassElementMetadata(
        taskKind,
      );

    const createInstanceTaskKindGraphNodes: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >[] = classElementsMetadata.map(
      (classElementMetadata: ClassElementMetadata) =>
        this.#createCreateInstanceTaskGraphNodeDependency(
          getInstanceDependenciesTaskGraphExpandCommand.context,
          classElementMetadata,
        ),
    );

    getInstanceDependenciesTaskGraphExpandCommand.node.dependencies = {
      nodes: createInstanceTaskKindGraphNodes,
      type: cuaktask.NodeDependenciesType.and,
    };
  }

  #createCreateInstanceTaskGraphNodeDependency(
    context: CreateInstanceTaskGraphExpandOperationContext,
    classElementMetadata: ClassElementMetadata,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    switch (classElementMetadata.type) {
      case ClassElementMetadataType.serviceId:
        return this.#createCreateInstanceTaskGraphNodeDependencyFromServiceId(
          context,
          classElementMetadata.value,
        );
      case ClassElementMetadataType.tag:
        return this.#createCreateInstanceTaskGraphNodeDependencyFromTag(
          context,
          classElementMetadata.value,
        );
    }
  }

  #createCreateInstanceTaskGraphNodeDependencyFromBinding(
    context: CreateInstanceTaskGraphExpandOperationContext,
    binding: Binding,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createInstanceTaskKind: CreateInstanceTaskKind = {
      binding: binding,
      requestId: context.requestId,
      type: TaskKindType.createInstance,
    };

    const createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    > = this.#createCreateInstanceTaskGraphNodeDependencyFromTaskKind(
      context,
      createInstanceTaskKind,
    );

    return createInstanceTaskKindGraphNodeDependency;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromServiceId(
    context: CreateInstanceTaskGraphExpandOperationContext,
    serviceId: ServiceId,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const binding: Binding = this.#getBinding(serviceId);

    const nodeDependency: cuaktask.NodeDependency<cuaktask.Task<TaskKind>> =
      this.#createCreateInstanceTaskGraphNodeDependencyFromBinding(
        context,
        binding,
      );

    addNodesToGraph(context.graph, nodeDependency);

    return nodeDependency;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTag(
    context: CreateInstanceTaskGraphExpandOperationContext,
    tag: BindingTag,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createTagInstancesTaskGraphNode: cuaktask.Node<
      cuaktask.Task<CreateTagInstancesTaskKind>
    > = {
      dependencies: undefined,
      element: new CreateTagInstancesTask({
        tag,
        type: TaskKindType.createTagInstances,
      }),
    };

    const createTagInstancesTaskGraphExpandCommand: CreateTagInstancesTaskGraphExpandCommand =
      {
        context,
        node: createTagInstancesTaskGraphNode,
        taskKindType: TaskGraphExpandCommandType.createTagInstances,
      };

    const result: void | Promise<void> = this.#bus.handle(
      createTagInstancesTaskGraphExpandCommand,
    );

    if (cuaktask.isPromiseLike(result)) {
      throw new Error('Expected syncronous flow');
    }

    return createTagInstancesTaskGraphNode;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTaskKind(
    context: CreateInstanceTaskGraphExpandOperationContext,
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskGraphNodeCommand =
      {
        context: {
          ...context,
          taskKind: createInstanceTaskKind,
        },
      };

    const createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    > = this.#createCreateInstanceTaskGraphNodeCommandHandler.handle(
      createCreateInstanceTaskGraphNodeCommand,
    );

    return createInstanceTaskKindGraphNodeDependency;
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding =
      this.#bindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }

  #getInstanceDependenciesTaskKindDependenciesClassElementMetadata(
    taskKind: GetInstanceDependenciesTaskKind,
  ): ClassElementMetadata[] {
    const metadata: ClassMetadata = taskKind.metadata;

    // GetInstanceDependenciesTask.innerPerfomr relies on this order
    const classElementsMetadata: ClassElementMetadata[] = [
      ...metadata.constructorArguments,
      ...metadata.properties.values(),
    ];

    return classElementsMetadata;
  }
}
