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
import { CreateCreateInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskNodeCommand';
import { CreateInstanceTaskNodeExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeExpandOperationContext';
import { CreateTagInstancesTask } from '../../models/cuaktask/CreateTagInstancesTask';
import { CreateTagInstancesTaskNodeExpandCommand } from '../../models/cuaktask/CreateTagInstancesTaskNodeExpandCommand';
import { GetInstanceDependenciesTaskNodeExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskNodeExpandCommand';
import { TaskNodeExpandCommand } from '../../models/cuaktask/TaskNodeExpandCommand';
import { TaskNodeExpandCommandType } from '../../models/cuaktask/TaskNodeExpandCommandType';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { CreateTagInstancesTaskKind } from '../../models/domain/CreateTagInstancesTaskKind';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class GetInstanceDependenciesTaskNodeExpandCommandHandler
  implements Handler<GetInstanceDependenciesTaskNodeExpandCommand, void>
{
  readonly #bindingService: BindingService;
  readonly #bus: Handler<TaskNodeExpandCommand, void | Promise<void>>;
  readonly #createCreateInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateInstanceTaskNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #metadataService: MetadataService;

  constructor(
    bindingService: BindingService,
    bus: Handler<TaskNodeExpandCommand, void | Promise<void>>,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskNodeCommand,
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
    getInstanceDependenciesTaskGraphExpandCommand: GetInstanceDependenciesTaskNodeExpandCommand,
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
    context: CreateInstanceTaskNodeExpandOperationContext,
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
    context: CreateInstanceTaskNodeExpandOperationContext,
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
    context: CreateInstanceTaskNodeExpandOperationContext,
    serviceId: ServiceId,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const binding: Binding = this.#getBinding(serviceId);

    const nodeDependency: cuaktask.NodeDependency<cuaktask.Task<TaskKind>> =
      this.#createCreateInstanceTaskGraphNodeDependencyFromBinding(
        context,
        binding,
      );

    return nodeDependency;
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTag(
    context: CreateInstanceTaskNodeExpandOperationContext,
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

    const createTagInstancesTaskGraphExpandCommand: CreateTagInstancesTaskNodeExpandCommand =
      {
        context,
        node: createTagInstancesTaskGraphNode,
        taskKindType: TaskNodeExpandCommandType.createTagInstances,
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
    context: CreateInstanceTaskNodeExpandOperationContext,
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createCreateInstanceTaskGraphNodeCommand: CreateCreateInstanceTaskNodeCommand =
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
