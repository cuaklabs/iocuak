import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../common/models/domain/ServiceId';
import { ContainerModuleMetadataApi } from '../models/api/ContainerModuleMetadataApi';
import { ContainerModuleLoadFromMetadataTaskKind } from '../models/domain/ContainerModuleLoadFromMetadataTaskKind';
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
        (containerModuleMetadata: ContainerModuleMetadataApi) => ({
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

    const loadModuleTaskKindGraphNodeInjects: ServiceId[] =
      loadModuleTaskKindGraphNode.kind.metadata.injects;

    if (loadModuleTaskKindGraphNodeInjects.length === 0) {
      loadModuleTaskKindGraphNode.dependencies.push(
        ...loadDependencyModuleTaskKindGraphNodes,
      );

      yield loadModuleTaskKindGraphNode;
    } else {
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
    }

    for (const loadModuleTaskKindGraphNode of loadDependencyModuleTaskKindGraphNodes) {
      yield* this.#expandKindGraphNodes(loadModuleTaskKindGraphNode);
    }
  }
}
