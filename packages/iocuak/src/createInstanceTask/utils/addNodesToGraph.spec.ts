import * as cuaktask from '@cuaklabs/cuaktask';
import { beforeAll, describe, expect, it } from '@jest/globals';

import { addNodesToGraph } from './addNodesToGraph';

describe(addNodesToGraph.name, () => {
  describe('having a node with node dependencies', () => {
    let nodeFixture: cuaktask.Node<cuaktask.Task<unknown>>;
    let nodeDendenciesFixture: cuaktask.NodeDependencies<
      cuaktask.Task<unknown>
    >;
    let nodeDendencyFixture: cuaktask.Node<cuaktask.Task<unknown>>;

    beforeAll(() => {
      nodeFixture = {
        dependencies: undefined,
        element: {
          _type: Symbol(),
        } as unknown as cuaktask.Task<unknown>,
      };

      nodeDendenciesFixture = {
        nodes: [nodeFixture],
        type: cuaktask.NodeDependenciesType.and,
      };

      nodeDendencyFixture = {
        dependencies: nodeDendenciesFixture,
        element: {
          _type: Symbol(),
        } as unknown as cuaktask.Task<unknown>,
      };
    });

    describe('when called', () => {
      let graphFixture: cuaktask.Graph<cuaktask.Task<unknown>>;

      let result: unknown;

      beforeAll(() => {
        graphFixture = {
          nodes: new Set(),
        };

        result = addNodesToGraph(graphFixture, nodeDendencyFixture);
      });

      it('should set graph.nodes', () => {
        expect(graphFixture.nodes).toStrictEqual(
          new Set([nodeDendencyFixture, nodeFixture]),
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a nodeDependency with node dependencies dependencies', () => {
    let nodeFixture: cuaktask.Node<cuaktask.Task<unknown>>;
    let nodeDendencyFixture: cuaktask.NodeDependencies<cuaktask.Task<unknown>>;

    beforeAll(() => {
      nodeFixture = {
        dependencies: undefined,
        element: {
          _type: Symbol(),
        } as unknown as cuaktask.Task<unknown>,
      };

      nodeDendencyFixture = {
        nodes: [
          {
            nodes: [nodeFixture],
            type: cuaktask.NodeDependenciesType.bitwiseOr,
          },
        ],
        type: cuaktask.NodeDependenciesType.and,
      };
    });

    describe('when called', () => {
      let graphFixture: cuaktask.Graph<cuaktask.Task<unknown>>;

      let result: unknown;

      beforeAll(() => {
        graphFixture = {
          nodes: new Set(),
        };

        result = addNodesToGraph(graphFixture, nodeDendencyFixture);
      });

      it('should set graph.nodes', () => {
        expect(graphFixture.nodes).toStrictEqual(new Set([nodeFixture]));
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
