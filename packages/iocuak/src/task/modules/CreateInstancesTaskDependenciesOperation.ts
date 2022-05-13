import * as cuaktask from '@cuaklabs/cuaktask';

import { Binding } from '../../binding/models/domain/Binding';
import { BindingScope } from '../../binding/models/domain/BindingScope';
import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { lazyGetBindingOrThrow } from '../../binding/utils/domain/lazyGetBindingOrThrow';
import { ClassMetadata } from '../../classMetadata/models/domain/ClassMetadata';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { stringifyServiceId } from '../../utils/stringifyServiceId';
import { CreateInstanceRootTaskKind } from '../models/domain/CreateInstanceRootTaskKind';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';

type CreateInstanceTaskKindGraphNode = cuaktask.TaskDependencyKindGraphNode<
  CreateInstanceTaskKind,
  TaskKind
>;

type TypeBindingCreateInstanceTaskKindGraphNode =
  cuaktask.TaskDependencyKindGraphNode<
    CreateInstanceTaskKind<TypeBinding>,
    TaskKind
  >;

type GetInstanceDependenciesTaskKindGraphNode =
  cuaktask.TaskDependencyKindGraphNode<
    GetInstanceDependenciesTaskKind,
    CreateInstanceTaskKind
  >;

type TaskKindGraphNode = cuaktask.TaskDependencyKindGraphNode<
  TaskKind,
  TaskKind
>;

type TaskKindGraph = cuaktask.TaskDependencyKindGraph<TaskKind, TaskKind>;

interface GetGetInstanceDependenciesTaskKindGraphNodeResult {
  node: GetInstanceDependenciesTaskKindGraphNode;
  dependenciesExpandOptions: CreateInstanceTaskKindGraphNodeExpandOptions[];
}

interface CreateInstanceTaskKindGraphNodeExpandOptions {
  node: CreateInstanceTaskKindGraphNode;
  expand: boolean;
}

export class CreateInstancesTaskDependenciesOperation {
  readonly #containerBindingService: BindingService;
  readonly #metadataService: MetadataService;
  readonly #serviceIdToRequestCreateInstanceTaskKindNode: Map<
    ServiceId,
    TypeBindingCreateInstanceTaskKindGraphNode
  >;
  readonly #serviceIdToSingletonCreateInstanceTaskKindNode: Map<
    ServiceId,
    TypeBindingCreateInstanceTaskKindGraphNode
  >;
  readonly #taskKind: TaskKind;
  readonly #taskKindSetBuilder: Builder<SetLike<TaskKind>>;

  constructor(
    containerBindingService: BindingService,
    metadataService: MetadataService,
    taskKind: TaskKind,
    taskKindSerBuilder: Builder<SetLike<TaskKind>>,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#metadataService = metadataService;
    this.#serviceIdToRequestCreateInstanceTaskKindNode = new Map();
    this.#serviceIdToSingletonCreateInstanceTaskKindNode = new Map();
    this.#taskKind = taskKind;
    this.#taskKindSetBuilder = taskKindSerBuilder;
  }

  public run(): TaskKindGraph {
    switch (this.#taskKind.type) {
      case TaskKindType.getInstanceDependencies:
        throw new Error('Unsupported type');
      case TaskKindType.createInstance:
        throw new Error('Unsupported type');
      case TaskKindType.createInstanceRoot:
        return this.#getCreateInstanceTaskKindDependencies(this.#taskKind);
    }
  }

  #getBinding(serviceId: ServiceId): Binding {
    const binding: Binding =
      this.#containerBindingService.get(serviceId) ??
      lazyGetBindingOrThrow(serviceId, this.#metadataService);

    return binding;
  }

  #getCreateInstanceTaskKindGraphNodeExpandOptions(
    taskKind: CreateInstanceTaskKind,
  ): CreateInstanceTaskKindGraphNodeExpandOptions {
    const createDependencyInstanceTaskKindGraphNode: CreateInstanceTaskKindGraphNode =
      {
        dependencies: [],
        kind: taskKind,
      };

    let nodeExpandOptions: CreateInstanceTaskKindGraphNodeExpandOptions = {
      expand: true,
      node: createDependencyInstanceTaskKindGraphNode,
    };

    if (this.#isTypeCreateInstanceTaskKind(taskKind)) {
      const binding: TypeBinding = taskKind.binding;

      switch (binding.scope) {
        case BindingScope.singleton:
          nodeExpandOptions =
            this.#getCreateInstanceTaskKindGraphNodeExpandOptionsOnScope(
              this.#serviceIdToSingletonCreateInstanceTaskKindNode,
              taskKind,
            );
          break;
        case BindingScope.request:
          nodeExpandOptions =
            this.#getCreateInstanceTaskKindGraphNodeExpandOptionsOnScope(
              this.#serviceIdToRequestCreateInstanceTaskKindNode,
              taskKind,
            );
          break;
        default:
          break;
      }
    }

    return nodeExpandOptions;
  }

  #getCreateInstanceTaskKindDependencies(
    taskKind: CreateInstanceRootTaskKind,
  ): TaskKindGraph {
    const binding: Binding = this.#getBinding(taskKind.id);

    const taskDependencyKindGraphRootNode: CreateInstanceTaskKindGraphNode = {
      dependencies: [],
      kind: {
        binding,
        requestId: taskKind.requestId,
        type: TaskKindType.createInstance,
      },
    };

    const taskKindSet: SetLike<TaskKind> = this.#taskKindSetBuilder.build();

    const taskDependencyKindGraph: TaskKindGraph = {
      nodes: [
        ...this.#expandCreateInstanceTaskKindGraphNodes(
          taskDependencyKindGraphRootNode,
          taskKindSet,
        ),
      ],
      rootNode: taskDependencyKindGraphRootNode,
    };

    return taskDependencyKindGraph;
  }

  #getGetInstanceDependenciesTaskKind(
    taskKind: CreateInstanceTaskKind<TypeBinding>,
  ): GetInstanceDependenciesTaskKind {
    const metadata: ClassMetadata = this.#metadataService.getClassMetadata(
      taskKind.binding.type,
    );

    const getInstanceDependenciesTaskKind: GetInstanceDependenciesTaskKind = {
      id: taskKind.binding.id,
      metadata: metadata,
      requestId: taskKind.requestId,
      type: TaskKindType.getInstanceDependencies,
    };

    return getInstanceDependenciesTaskKind;
  }

  #getGetInstanceDependenciesTaskKindDependencies(
    taskKind: GetInstanceDependenciesTaskKind,
  ): CreateInstanceTaskKind[] {
    const serviceIds: ServiceId[] =
      this.#getInstanceDependenciesTaskKindDependenciesServiceIds(taskKind);

    const createInstanceTaskKinds: CreateInstanceTaskKind[] = serviceIds.map(
      (serviceId: ServiceId): CreateInstanceTaskKind => ({
        binding: this.#getBinding(serviceId),
        requestId: taskKind.requestId,
        type: TaskKindType.createInstance,
      }),
    );

    return createInstanceTaskKinds;
  }

  #getGetInstanceDependenciesTaskKindGraphNode(
    taskKind: CreateInstanceTaskKind<TypeBinding>,
  ): GetGetInstanceDependenciesTaskKindGraphNodeResult {
    const getInstanceDependenciesTaskKind: GetInstanceDependenciesTaskKind =
      this.#getGetInstanceDependenciesTaskKind(taskKind);

    const createDependencyTaskKinds: CreateInstanceTaskKind[] =
      this.#getGetInstanceDependenciesTaskKindDependencies(
        getInstanceDependenciesTaskKind,
      );

    const dependenciesExpandOptions: CreateInstanceTaskKindGraphNodeExpandOptions[] =
      createDependencyTaskKinds.map((taskKind: CreateInstanceTaskKind) =>
        this.#getCreateInstanceTaskKindGraphNodeExpandOptions(taskKind),
      );

    const getInstanceDependenciesTaskNode: GetInstanceDependenciesTaskKindGraphNode =
      {
        dependencies: dependenciesExpandOptions.map(
          (
            dependencyExpandOptions: CreateInstanceTaskKindGraphNodeExpandOptions,
          ) => dependencyExpandOptions.node,
        ),
        kind: getInstanceDependenciesTaskKind,
      };

    const getGetInstanceDependenciesTaskKindGraphNodeResult: GetGetInstanceDependenciesTaskKindGraphNodeResult =
      {
        dependenciesExpandOptions: dependenciesExpandOptions,
        node: getInstanceDependenciesTaskNode,
      };

    return getGetInstanceDependenciesTaskKindGraphNodeResult;
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

  #getCreateInstanceTaskKindGraphNodeExpandOptionsOnScope(
    serviceIdToCreateInstanceTaskKindNodeMap: Map<
      ServiceId,
      TypeBindingCreateInstanceTaskKindGraphNode
    >,
    taskKind: CreateInstanceTaskKind<TypeBinding>,
  ): CreateInstanceTaskKindGraphNodeExpandOptions {
    let expandNodeOptions: CreateInstanceTaskKindGraphNodeExpandOptions;

    const binding: TypeBinding = taskKind.binding;

    const existingNode: TypeBindingCreateInstanceTaskKindGraphNode | undefined =
      serviceIdToCreateInstanceTaskKindNodeMap.get(binding.id);

    if (existingNode === undefined) {
      const createInstanceTaskKindGraphNode: TypeBindingCreateInstanceTaskKindGraphNode =
        {
          dependencies: [],
          kind: taskKind,
        };

      serviceIdToCreateInstanceTaskKindNodeMap.set(
        binding.id,
        createInstanceTaskKindGraphNode,
      );

      expandNodeOptions = {
        expand: true,
        node: createInstanceTaskKindGraphNode,
      };
    } else {
      expandNodeOptions = {
        expand: false,
        node: existingNode,
      };
    }

    return expandNodeOptions;
  }

  *#expandCreateInstanceTaskKindGraphNodes(
    createInstanceTaskKindGraphNode: CreateInstanceTaskKindGraphNode,
    taskKindSet: SetLike<TaskKind>,
  ): Iterable<TaskKindGraphNode> {
    if (
      this.#isTypeBindingCreateInstanceTaskKindGraphNode(
        createInstanceTaskKindGraphNode,
      )
    ) {
      yield* this.#expandCreateInstanceTypeTaskKindGraphNodes(
        createInstanceTaskKindGraphNode,
        taskKindSet,
      );
    } else {
      yield createInstanceTaskKindGraphNode;
    }
  }

  *#expandCreateInstanceTypeTaskKindGraphNodes(
    createInstanceTaskKindGraphNode: TypeBindingCreateInstanceTaskKindGraphNode,
    taskKindSet: SetLike<TaskKind>,
  ): Iterable<TaskKindGraphNode> {
    if (taskKindSet.has(createInstanceTaskKindGraphNode.kind)) {
      throw new Error(
        `Circular dependency found related to ${stringifyServiceId(
          createInstanceTaskKindGraphNode.kind.binding.id,
        )}!`,
      );
    } else {
      taskKindSet.add(createInstanceTaskKindGraphNode.kind);

      const getInstanceDependenciesTaskNodeResult: GetGetInstanceDependenciesTaskKindGraphNodeResult =
        this.#getGetInstanceDependenciesTaskKindGraphNode(
          createInstanceTaskKindGraphNode.kind,
        );

      createInstanceTaskKindGraphNode.dependencies.push(
        getInstanceDependenciesTaskNodeResult.node,
      );

      yield createInstanceTaskKindGraphNode;
      yield getInstanceDependenciesTaskNodeResult.node;

      for (const dependencyExpandOptions of getInstanceDependenciesTaskNodeResult.dependenciesExpandOptions) {
        if (dependencyExpandOptions.expand) {
          yield* this.#expandCreateInstanceTaskKindGraphNodes(
            dependencyExpandOptions.node,
            taskKindSet,
          );
        }
      }

      taskKindSet.delete(createInstanceTaskKindGraphNode.kind);
    }
  }

  #isTypeBindingCreateInstanceTaskKindGraphNode(
    createInstanceTaskKindGraphNode: CreateInstanceTaskKindGraphNode,
  ): createInstanceTaskKindGraphNode is TypeBindingCreateInstanceTaskKindGraphNode {
    return this.#isTypeCreateInstanceTaskKind(
      createInstanceTaskKindGraphNode.kind,
    );
  }

  #isTypeCreateInstanceTaskKind(
    createInstanceTaskKind: CreateInstanceTaskKind,
  ): createInstanceTaskKind is CreateInstanceTaskKind<TypeBinding> {
    return createInstanceTaskKind.binding.bindingType === BindingType.type;
  }
}
