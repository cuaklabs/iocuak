import * as cuaktask from '@cuaklabs/cuaktask';

import { PickKeys } from '../../common/models/domain/PickKeys';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerModuleFactoryMetadata } from '../models/domain/ContainerModuleFactoryMetadata';
import { ContainerModuleLoadFromMetadataTaskKind } from '../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleMetadata } from '../models/domain/ContainerModuleMetadata';
import { ContainerModuleMetadataType } from '../models/domain/ContainerModuleMetadataType';
import { ContainerModuleTaskKind } from '../models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskKindType } from '../models/domain/ContainerModuleTaskKindType';

type LoadModuleTaskKindGraphNode = cuaktask.TaskDependencyKindGraphNode<
  ContainerModuleLoadFromMetadataTaskKind,
  ContainerModuleTaskKind
>;

type TaskKindGraphNode = cuaktask.TaskDependencyKindGraphNode<
  ContainerModuleTaskKind,
  ContainerModuleTaskKind
>;

type TaskDependencyKindGraph = cuaktask.TaskDependencyKindGraph<
  ContainerModuleTaskKind,
  ContainerModuleTaskKind
>;

export class ContainerModuleTaskDependencyEngine
  implements
    cuaktask.TaskDependencyEngine<
      ContainerModuleTaskKind,
      ContainerModuleTaskKind
    >
{
  public getDependencies(
    taskKind: ContainerModuleTaskKind,
  ): TaskDependencyKindGraph {
    switch (taskKind.type) {
      case ContainerModuleTaskKindType.createInstances:
        throw new Error('Unsupported type');
      case ContainerModuleTaskKindType.loadFromMetadata:
        return this.#getLoadFromMetadataTaskKindDependencies(taskKind);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  static #isFactoryMetadataWithInjects(
    metadata: ContainerModuleMetadata,
  ): metadata is ContainerModuleFactoryMetadata & {
    [T in PickKeys<ContainerModuleFactoryMetadata, 'injects'>]: [ServiceId] &
      ServiceId[];
  } {
    return (
      metadata.type === ContainerModuleMetadataType.factory &&
      metadata.injects.length !== 0
    );
  }

  #getLoadFromMetadataTaskKindDependencies(
    taskKind: ContainerModuleLoadFromMetadataTaskKind,
  ): TaskDependencyKindGraph {
    const taskDependencyKindGraphRootNode: LoadModuleTaskKindGraphNode = {
      dependencies: [],
      kind: taskKind,
    };

    const taskDependencyKindGraphNodes: TaskKindGraphNode[] = [
      ...this.#expandKindGraphNodes(taskDependencyKindGraphRootNode),
    ];

    const taskDependencyKindGraph: TaskDependencyKindGraph = {
      nodes: taskDependencyKindGraphNodes,
      rootNode: taskDependencyKindGraphRootNode,
    };

    return taskDependencyKindGraph;
  }

  #buildCreateInstancesTaskKindGraphNode(
    injects: ServiceId[],
    dependencies: LoadModuleTaskKindGraphNode[],
  ): TaskKindGraphNode {
    const createInstancesTaskKindGraphNode: TaskKindGraphNode = {
      dependencies,
      kind: {
        serviceIds: injects,
        type: ContainerModuleTaskKindType.createInstances,
      },
    };

    return createInstancesTaskKindGraphNode;
  }

  #buildLoadDependencyModuleTaskKindGraphNodes(
    loadModuleTaskKindGraphNode: LoadModuleTaskKindGraphNode,
  ): LoadModuleTaskKindGraphNode[] {
    const loadDependencyModuleTaskKindGraphNodes: LoadModuleTaskKindGraphNode[] =
      loadModuleTaskKindGraphNode.kind.metadata.imports.map(
        (containerModuleMetadata: ContainerModuleMetadata) => ({
          dependencies: [],
          kind: {
            metadata: containerModuleMetadata,
            type: ContainerModuleTaskKindType.loadFromMetadata,
          },
        }),
      );

    return loadDependencyModuleTaskKindGraphNodes;
  }

  *#expandKindGraphNodes(
    loadModuleTaskKindGraphNode: LoadModuleTaskKindGraphNode,
  ): Iterable<TaskKindGraphNode> {
    const loadDependencyModuleTaskKindGraphNodes: LoadModuleTaskKindGraphNode[] =
      this.#buildLoadDependencyModuleTaskKindGraphNodes(
        loadModuleTaskKindGraphNode,
      );

    const metadata: ContainerModuleMetadata =
      loadModuleTaskKindGraphNode.kind.metadata;

    if (
      ContainerModuleTaskDependencyEngine.#isFactoryMetadataWithInjects(
        metadata,
      )
    ) {
      const loadModuleTaskKindGraphNodeInjects: [ServiceId] & ServiceId[] =
        metadata.injects;

      const createInstancesTaskKindGraphNode: TaskKindGraphNode =
        this.#buildCreateInstancesTaskKindGraphNode(
          loadModuleTaskKindGraphNodeInjects,
          loadDependencyModuleTaskKindGraphNodes,
        );

      loadModuleTaskKindGraphNode.dependencies.push(
        createInstancesTaskKindGraphNode,
      );

      yield loadModuleTaskKindGraphNode;
      yield createInstancesTaskKindGraphNode;
    } else {
      loadModuleTaskKindGraphNode.dependencies.push(
        ...loadDependencyModuleTaskKindGraphNodes,
      );

      yield loadModuleTaskKindGraphNode;
    }

    for (const loadModuleTaskKindGraphNode of loadDependencyModuleTaskKindGraphNodes) {
      yield* this.#expandKindGraphNodes(loadModuleTaskKindGraphNode);
    }
  }
}
