import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../../binding/models/domain/Binding';
import { BindingType } from '../../../binding/models/domain/BindingType';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassMetadata } from '../../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { CreateCreateInstanceTaskGraphNodeCommand } from '../../models/cuaktask/CreateCreateInstanceTaskGraphNodeCommand';
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
    CreateCreateInstanceTaskGraphNodeCommand,
    cuaktask.NodeDependency<cuaktask.Task<TaskKind>>
  >;
  readonly #metadataService: MetadataService;

  constructor(
    bindingService: BindingService,
    containerRequestService: ContainerRequestService,
    containerSingletonService: ContainerSingletonService,
    createCreateInstanceTaskGraphNodeCommandHandler: Handler<
      CreateCreateInstanceTaskGraphNodeCommand,
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
    const createInstanceTaskKinds: CreateInstanceTaskKind[] =
      this.#getGetInstanceDependenciesTaskKindDependencies(
        getInstanceDependenciesTaskGraphExpandCommand.context,
        getInstanceDependenciesTaskGraphExpandCommand.node.element.kind,
      );

    const createInstanceTaskKindGraphNodes: cuaktask.NodeDependency<
      cuaktask.Task<TaskKind>
    >[] = createInstanceTaskKinds.map(
      (createInstanceTaskKind: CreateInstanceTaskKind) =>
        this.#createCreateInstanceTaskGraphNodeDependency(
          getInstanceDependenciesTaskGraphExpandCommand.context,
          createInstanceTaskKind,
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
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): cuaktask.NodeDependency<cuaktask.Task<TaskKind>> {
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

  #createCreateInstanceTypeBindingTaskGraphNodeDependency(
    context: CreateInstanceTaskGraphExpandOperationContext,
    createInstanceTaskKind: CreateInstanceTaskKind<TypeBinding>,
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

  #getGetInstanceDependenciesTaskKindDependencies(
    context: CreateInstanceTaskGraphExpandOperationContext,
    taskKind: GetInstanceDependenciesTaskKind,
  ): CreateInstanceTaskKind[] {
    const serviceIds: ServiceId[] =
      this.#getInstanceDependenciesTaskKindDependenciesServiceIds(taskKind);

    const createInstanceTaskKinds: CreateInstanceTaskKind[] = serviceIds.map(
      (serviceId: ServiceId): CreateInstanceTaskKind => ({
        binding: this.#getBinding(serviceId),
        requestId: context.requestId,
        type: TaskKindType.createInstance,
      }),
    );

    return createInstanceTaskKinds;
  }

  #getInstanceDependenciesTaskKindDependenciesServiceIds(
    taskKind: GetInstanceDependenciesTaskKind,
  ): ServiceId[] {
    const metadata: ClassMetadata = taskKind.metadata;

    // GetInstanceDependenciesTask.innerPerfomr relies on this order
    const servicesId: ServiceId[] = [
      ...metadata.constructorArguments,
      ...metadata.properties.values(),
    ];

    return servicesId;
  }

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }
}
