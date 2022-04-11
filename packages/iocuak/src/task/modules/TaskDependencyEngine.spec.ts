import * as cuaktask from '@cuaklabs/cuaktask';

import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { DirectTaskDependencyEngine } from './DirectTaskDependencyEngine';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(TaskDependencyEngine.name, () => {
  let directTaskDependencyEngineMock: jest.Mocked<DirectTaskDependencyEngine>;
  let taskKindSerBuilderMock: jest.Mocked<Builder<SetLike<TaskKind>>>;

  let taskDependencyEngine: TaskDependencyEngine;

  beforeAll(() => {
    directTaskDependencyEngineMock = {
      getDirectDependencies: jest.fn(),
    } as Partial<
      jest.Mocked<DirectTaskDependencyEngine>
    > as jest.Mocked<DirectTaskDependencyEngine>;
    taskKindSerBuilderMock = {
      build: jest.fn(),
    };

    taskDependencyEngine = new TaskDependencyEngine(
      directTaskDependencyEngineMock,
      taskKindSerBuilderMock,
    );
  });

  describe('.getDependencies', () => {
    let taskKindFixture: TaskKind;

    beforeAll(() => {
      taskKindFixture = {
        id: 'service-id',
        requestId: Symbol(),
        type: TaskKindType.createInstance,
      };
    });

    describe('when called, and no direct dependencies are found', () => {
      let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
      let result: unknown;

      beforeAll(() => {
        taskKindSetMock = {
          add: jest.fn(),
          delete: jest.fn(),
          has: jest.fn().mockReturnValueOnce(false),
        } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
          SetLike<TaskKind>
        >;

        taskKindSerBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

        directTaskDependencyEngineMock.getDirectDependencies.mockReturnValueOnce(
          [],
        );

        result = taskDependencyEngine.getDependencies(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskKindSet.has()', () => {
        expect(taskKindSetMock.has).toHaveBeenCalledTimes(1);
        expect(taskKindSetMock.has).toHaveBeenCalledWith(taskKindFixture);
      });

      it('should call directTaskDependencyEngine.getDirectDependencies()', () => {
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenCalledTimes(1);
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenCalledWith(taskKindFixture);
      });

      it('should return a task kind graph', () => {
        const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
          {
            dependencies: [],
            kind: taskKindFixture,
          };

        const expectedKindGraph: cuaktask.TaskDependencyKindGraph<TaskKind> = {
          nodes: [expectedKindGraphNode],
          rootNode: expectedKindGraphNode,
        };

        expect(result).toStrictEqual(expectedKindGraph);
      });
    });

    describe('when called, and a non circular dependency is found', () => {
      let dependencyTaskKindFixture: TaskKind;
      let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
      let result: unknown;

      beforeAll(() => {
        dependencyTaskKindFixture = {
          id: 'dependency-service-id',
          requestId: Symbol(),
          type: TaskKindType.createInstance,
        };

        taskKindSetMock = {
          add: jest.fn(),
          delete: jest.fn(),
          has: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(false),
        } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
          SetLike<TaskKind>
        >;

        taskKindSerBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

        directTaskDependencyEngineMock.getDirectDependencies
          .mockReturnValueOnce([dependencyTaskKindFixture])
          .mockReturnValueOnce([]);

        result = taskDependencyEngine.getDependencies(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskKindSet.has()', () => {
        expect(taskKindSetMock.has).toHaveBeenCalledTimes(2);
        expect(taskKindSetMock.has).toHaveBeenNthCalledWith(1, taskKindFixture);
        expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
          2,
          dependencyTaskKindFixture,
        );
      });

      it('should call directTaskDependencyEngine.getDirectDependencies()', () => {
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenCalledTimes(2);
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenNthCalledWith(1, taskKindFixture);
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenNthCalledWith(2, dependencyTaskKindFixture);
      });

      it('should return a task kind graph', () => {
        const dependencyTaskKindGraphNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
          {
            dependencies: [],
            kind: dependencyTaskKindFixture,
          };
        const expectedKindGraphNode: cuaktask.TaskDependencyKindGraphNode<TaskKind> =
          {
            dependencies: [dependencyTaskKindGraphNode],
            kind: taskKindFixture,
          };

        const expectedKindGraph: cuaktask.TaskDependencyKindGraph<TaskKind> = {
          nodes: [expectedKindGraphNode, dependencyTaskKindGraphNode],
          rootNode: expectedKindGraphNode,
        };

        expect(result).toStrictEqual(expectedKindGraph);
      });
    });

    describe('when called, and a circular dependency is found', () => {
      let dependencyTaskKindFixture: TaskKind;
      let taskKindSetMock: jest.Mocked<SetLike<TaskKind>>;
      let result: unknown;

      beforeAll(() => {
        dependencyTaskKindFixture = taskKindFixture;

        taskKindSetMock = {
          add: jest.fn(),
          delete: jest.fn(),
          has: jest.fn().mockReturnValueOnce(false).mockReturnValueOnce(true),
        } as Partial<jest.Mocked<SetLike<TaskKind>>> as jest.Mocked<
          SetLike<TaskKind>
        >;

        taskKindSerBuilderMock.build.mockReturnValueOnce(taskKindSetMock);

        directTaskDependencyEngineMock.getDirectDependencies.mockReturnValueOnce(
          [dependencyTaskKindFixture],
        );

        try {
          taskDependencyEngine.getDependencies(taskKindFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskKindSet.has()', () => {
        expect(taskKindSetMock.has).toHaveBeenCalledTimes(2);
        expect(taskKindSetMock.has).toHaveBeenNthCalledWith(1, taskKindFixture);
        expect(taskKindSetMock.has).toHaveBeenNthCalledWith(
          2,
          dependencyTaskKindFixture,
        );
      });

      it('should call directTaskDependencyEngine.getDirectDependencies()', () => {
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenCalledTimes(1);
        expect(
          directTaskDependencyEngineMock.getDirectDependencies,
        ).toHaveBeenCalledWith(taskKindFixture);
      });

      it('should throw an error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message: `Circular dependency found related to ${
              taskKindFixture.id as string
            }!`,
          }),
        );
      });
    });
  });
});
