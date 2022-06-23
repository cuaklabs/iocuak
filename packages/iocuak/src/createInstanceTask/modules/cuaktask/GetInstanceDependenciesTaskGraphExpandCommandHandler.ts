import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassElementMetadata } from '../../../classMetadata/models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../../../classMetadata/models/domain/ClassElementMetadataType';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateCreateTypeBindingInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskGraphNodeCommand';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { TaskKindType } from '../../models/domain/TaskKindType';

export class GetInstanceDependenciesTaskGraphExpandCommandHandler
  implements Handler<GetInstanceDependenciesTaskGraphExpandCommand, void>
{
  readonly #bindingService: BindingService;
  readonly #containerRequestService: ContainerRequestService;
  readonly #containerSingletonService: ContainerSingletonService;
  readonly #createCreateInstanceTaskGraphNodeCommandHandler: Handler<
    CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #metadataService: MetadataService;

  constructor(
    bindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateTypeBindingInstanceTaskGraphNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
    >,
    metadataService: MetadataService,
  ) {
    this.#bindingService = bindingService;
    this.#containerRequestService = containerRequestService;
    this.#containerSingletonService = containerSingletonService;
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

    this.#addNodesToGraph(
      getInstanceDependenciesTaskGraphExpandCommand.context.graph,
      getInstanceDependenciesTaskGraphExpandCommand.node.dependencies,
    );
  }

  #addNodesToGraph(
    graph: cuaktask.Graph<cuaktask.Task<unknown>>,
    nodeDependencies: cuaktask.NodeDependencies<cuaktask.Task<unknown>>,
  ): void {
    for (const nodeDependency of nodeDependencies.nodes) {
      if (
        (nodeDependency as cuaktask.NodeDependencies<cuaktask.Task<unknown>>)
          .nodes === undefined
      ) {
        graph.nodes.add(
          nodeDependency as cuaktask.Node<cuaktask.Task<unknown>>,
        );
      } else {
        this.#addNodesToGraph(
          graph,
          nodeDependency as cuaktask.NodeDependencies<cuaktask.Task<unknown>>,
        );
      }
    }
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

    let createInstanceTaskKindGraphNodeDependency: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >;

    if (this.#isTypeCreateInstanceTaskKind(createInstanceTaskKind)) {
      createInstanceTaskKindGraphNodeDependency =
        this.#createCreateInstanceTypeBindingTaskGraphNodeDependency(
          context,
          createInstanceTaskKind,
        );
    } else {
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

  #createCreateInstanceTaskGraphNodeDependencyFromServiceId(
    context: CreateInstanceTaskGraphExpandOperationContext,
    serviceId: ServiceId,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const binding: Binding = this.#getBinding(serviceId);

    return this.#createCreateInstanceTaskGraphNodeDependencyFromBinding(
      context,
      binding,
    );
  }

  #createCreateInstanceTaskGraphNodeDependencyFromTag(
    context: CreateInstanceTaskGraphExpandOperationContext,
    tag: BindingTag,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const bindings: Binding[] = [...this.#getBindings(tag)];
    const tagServiceNodes: cuaktask.NodeDependency<cuaktask.Task<TaskKind>>[] =
      bindings.map((binding: Binding) =>
        this.#createCreateInstanceTaskGraphNodeDependencyFromBinding(
          context,
          binding,
        ),
      );

    const nodeDependency: cuaktask.AndNodeDependencies<
      cuaktask.Task<TaskKind>
    > = {
      nodes: tagServiceNodes,
      type: cuaktask.NodeDependenciesType.and,
    };

    return nodeDependency;
  }

  #createCreateInstanceTypeBindingTaskGraphNodeDependency(
    context: CreateInstanceTaskGraphExpandOperationContext,
    createInstanceTaskKind: CreateInstanceTaskKind<TypeBinding>,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
    const createCreateInstanceTaskGraphNodeCommand: CreateCreateTypeBindingInstanceTaskGraphNodeCommand =
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

  #getBindings(tag: BindingTag): Iterable<Binding> {
    const bindings: Iterable<Binding> = this.#bindingService.getByTag(
      tag,
      true,
    );

    return bindings;
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

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }
}
