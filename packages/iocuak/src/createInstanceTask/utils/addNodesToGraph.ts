import * as cuaktask from '@cuaklabs/cuaktask';

export function addNodesToGraph<T>(
  graph: cuaktask.Graph<cuaktask.Task<T>>,
  nodeDependency: cuaktask.NodeDependency<cuaktask.Task<T>>,
): void {
  if (isNode(nodeDependency)) {
    graph.nodes.add(nodeDependency);

    if (nodeDependency.dependencies !== undefined) {
      addNodesToGraph(graph, nodeDependency.dependencies);
    }
  } else {
    for (const nodeDependencyNode of nodeDependency.nodes) {
      addNodesToGraph(graph, nodeDependencyNode);
    }
  }
}

function isNode<T>(
  nodeDependency: cuaktask.NodeDependency<cuaktask.Task<T>>,
): nodeDependency is cuaktask.Node<cuaktask.Task<T>> {
  return (
    (nodeDependency as cuaktask.NodeDependencies<cuaktask.Task<T>>).nodes ===
    undefined
  );
}
