import * as cuaktask from '@cuaklabs/cuaktask';

export function addNodesToGraph<T>(
  graph: cuaktask.Graph<cuaktask.Task<T>>,
  nodeDependencies: cuaktask.NodeDependencies<cuaktask.Task<T>>,
): void {
  for (const nodeDependency of nodeDependencies.nodes) {
    if (isNode(nodeDependency)) {
      graph.nodes.add(nodeDependency);
    } else {
      addNodesToGraph(graph, nodeDependency);
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
