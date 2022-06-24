import * as cuaktask from '@cuaklabs/cuaktask';
import { beforeAll, describe, expect, it } from '@jest/globals';

import { addNodesToGraph } from './addNodesToGraph';

describe(addNodesToGraph.name, () => {
  describe('having a nodeDendencies with node dependencies', () => {
    let nodeFixture: cuaktask.Node<cuaktask.Task<unknown>>;
    let nodeDendenciesFixture: cuaktask.NodeDependencies<
      cuaktask.Task<unknown>
    >;

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
    });

    describe('when called', () => {
      let graphFixture: cuaktask.Graph<cuaktask.Task<unknown>>;

      let result: unknown;

      beforeAll(() => {
        graphFixture = {
          nodes: new Set(),
        };

        result = addNodesToGraph(graphFixture, nodeDendenciesFixture);
      });

      it('should set graph.nodes', () => {
        expect(graphFixture.nodes).toStrictEqual(new Set([nodeFixture]));
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a nodeDendencies with node dependencies dependencies', () => {
    let nodeFixture: cuaktask.Node<cuaktask.Task<unknown>>;
    let nodeDendenciesFixture: cuaktask.NodeDependencies<
      cuaktask.Task<unknown>
    >;

    beforeAll(() => {
      nodeFixture = {
        dependencies: undefined,
        element: {
          _type: Symbol(),
        } as unknown as cuaktask.Task<unknown>,
      };

      nodeDendenciesFixture = {
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

        result = addNodesToGraph(graphFixture, nodeDendenciesFixture);
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
