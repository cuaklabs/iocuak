import { Node } from '../../graph/models/domain/Node';
import { NodeDependencies } from '../../graph/models/domain/NodeDependencies';
import { NodeDependenciesType } from '../../graph/models/domain/NodeDependenciesType';
import { RootedGraph } from '../../graph/models/domain/RootedGraph';
import { Task } from '../models/domain/Task';
import { TaskStatus } from '../models/domain/TaskStatus';
import { RootedTaskGraphRunner } from './RootedTaskGraphRunner';

type UnknownTask<TKind> = Task<TKind, unknown[], unknown>;

describe(RootedTaskGraphRunner.name, () => {
  let rootedTaskGraphRunner: RootedTaskGraphRunner;

  beforeAll(() => {
    rootedTaskGraphRunner = new RootedTaskGraphRunner();
  });

  describe('.run', () => {
    describe.each<[string, NodeDependencies<UnknownTask<unknown>> | undefined]>(
      [
        ['with no dependencies', undefined],
        [
          'with empty and dependencies',
          {
            nodes: [],
            type: NodeDependenciesType.and,
          },
        ],
      ],
    )(
      'having a graph with a single root node %s',
      (
        _: string,
        nodeDependencies: NodeDependencies<UnknownTask<unknown>> | undefined,
      ) => {
        let graphFixture: RootedGraph<UnknownTask<unknown>>;
        let nodeFixture: Node<UnknownTask<unknown>>;

        let taskResult: unknown;

        let taskMock: jest.Mocked<UnknownTask<unknown>>;
        let taskMockStatus: TaskStatus;

        beforeAll(() => {
          taskResult = Symbol();

          taskMock = {
            kind: Symbol(),
            perform: jest.fn(),
            result: undefined,
            get status(): TaskStatus {
              return taskMockStatus;
            },
          };

          nodeFixture = {
            dependencies: nodeDependencies,
            element: taskMock,
          };

          graphFixture = {
            nodes: [nodeFixture],
            root: nodeFixture,
          };
        });

        describe('when called', () => {
          let result: unknown;

          beforeAll(() => {
            taskMockStatus = TaskStatus.NotStarted;

            taskMock.perform.mockImplementationOnce(() => {
              taskMockStatus = TaskStatus.Ended;

              return taskResult;
            });

            result = rootedTaskGraphRunner.run(graphFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call rootTask.perform', () => {
            expect(taskMock.perform).toHaveBeenCalledTimes(1);
            expect(taskMock.perform).toHaveBeenCalledWith();
          });

          it('should return a result', () => {
            expect(result).toBe(taskResult);
          });
        });

        describe('when called, and task returns a promise', () => {
          let result: unknown;

          beforeAll(async () => {
            taskMockStatus = TaskStatus.NotStarted;

            taskMock.perform.mockImplementationOnce(async () => {
              taskMockStatus = TaskStatus.Ended;

              return taskResult;
            });

            result = await rootedTaskGraphRunner.run(graphFixture);
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call rootTask.perform', () => {
            expect(taskMock.perform).toHaveBeenCalledTimes(1);
            expect(taskMock.perform).toHaveBeenCalledWith();
          });

          it('should return a result', () => {
            expect(result).toBe(taskResult);
          });
        });

        describe('when called, and task throws an error', () => {
          let result: unknown;

          beforeAll(() => {
            taskMockStatus = TaskStatus.NotStarted;

            taskMock.perform.mockImplementationOnce(() => {
              throw new Error();
            });

            try {
              rootedTaskGraphRunner.run(graphFixture);
            } catch (error: unknown) {
              result = error;
            }
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call rootTask.perform', () => {
            expect(taskMock.perform).toHaveBeenCalledTimes(1);
            expect(taskMock.perform).toHaveBeenCalledWith();
          });

          it('should throw an error', () => {
            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining<Partial<Error>>({
                message: 'Unable to recover from at least one task failure',
              }),
            );
          });
        });

        describe('when called, and task status changes to error', () => {
          let result: unknown;

          beforeAll(() => {
            taskMockStatus = TaskStatus.NotStarted;

            taskMock.perform.mockImplementationOnce(() => {
              taskMockStatus = TaskStatus.Error;
            });

            try {
              rootedTaskGraphRunner.run(graphFixture);
            } catch (error: unknown) {
              result = error;
            }
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call rootTask.perform', () => {
            expect(taskMock.perform).toHaveBeenCalledTimes(1);
            expect(taskMock.perform).toHaveBeenCalledWith();
          });

          it('should throw an error', () => {
            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining<Partial<Error>>({
                message: 'Unable to recover from at least one task failure',
              }),
            );
          });
        });

        describe('when called, and task returns a rejected promise', () => {
          let result: unknown;

          beforeAll(async () => {
            taskMockStatus = TaskStatus.NotStarted;

            taskMock.perform.mockImplementationOnce(async () => {
              throw new Error();
            });

            try {
              await rootedTaskGraphRunner.run(graphFixture);
            } catch (error: unknown) {
              result = error;
            }
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should call rootTask.perform', () => {
            expect(taskMock.perform).toHaveBeenCalledTimes(1);
            expect(taskMock.perform).toHaveBeenCalledWith();
          });

          it('should throw an error', () => {
            expect(result).toBeInstanceOf(Error);
            expect(result).toStrictEqual(
              expect.objectContaining<Partial<Error>>({
                message: 'Unable to recover from at least one task failure',
              }),
            );
          });
        });
      },
    );

    describe('having a graph with a single root node with empty bitwiseOr dependencies', () => {
      let graphFixture: RootedGraph<UnknownTask<unknown>>;
      let nodeFixture: Node<UnknownTask<unknown>>;

      let taskResult: unknown;

      let taskMock: jest.Mocked<UnknownTask<unknown>>;
      let taskMockStatus: TaskStatus;

      beforeAll(() => {
        taskResult = Symbol();

        taskMock = {
          kind: Symbol(),
          perform: jest.fn(),
          result: undefined,
          get status(): TaskStatus {
            return taskMockStatus;
          },
        };

        nodeFixture = {
          dependencies: {
            nodes: [],
            type: NodeDependenciesType.bitwiseOr,
          },
          element: taskMock,
        };

        graphFixture = {
          nodes: [nodeFixture],
          root: nodeFixture,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          taskMockStatus = TaskStatus.NotStarted;

          taskMock.perform.mockImplementationOnce(() => {
            taskMockStatus = TaskStatus.Ended;

            return taskResult;
          });

          try {
            rootedTaskGraphRunner.run(graphFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call rootTask.perform', () => {
          expect(taskMock.perform).not.toHaveBeenCalled();
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Unable to recover from at least one task failure',
            }),
          );
        });
      });
    });

    describe('having a graph with a single node with and dependencies with empty and dependencies', () => {
      let graphFixture: RootedGraph<UnknownTask<unknown>>;
      let nodeFixture: Node<UnknownTask<unknown>>;

      let taskResult: unknown;

      let taskMock: jest.Mocked<UnknownTask<unknown>>;
      let taskMockStatus: TaskStatus;

      beforeAll(() => {
        taskResult = Symbol();

        taskMock = {
          kind: Symbol(),
          perform: jest.fn(),
          result: undefined,
          get status(): TaskStatus {
            return taskMockStatus;
          },
        };

        nodeFixture = {
          dependencies: {
            nodes: [
              {
                nodes: [],
                type: NodeDependenciesType.and,
              },
            ],
            type: NodeDependenciesType.and,
          },
          element: taskMock,
        };

        graphFixture = {
          nodes: [nodeFixture],
          root: nodeFixture,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          taskMockStatus = TaskStatus.NotStarted;

          taskMock.perform.mockImplementationOnce(() => {
            taskMockStatus = TaskStatus.Ended;

            return taskResult;
          });

          result = rootedTaskGraphRunner.run(graphFixture);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call rootTask.perform', () => {
          expect(taskMock.perform).toHaveBeenCalledTimes(1);
          expect(taskMock.perform).toHaveBeenCalledWith([]);
        });

        it('should return a result', () => {
          expect(result).toBe(taskResult);
        });
      });
    });

    describe('having a dependency node', () => {
      let dependencyNodeFixture: Node<UnknownTask<unknown>>;

      let dependencyTaskResult: unknown;
      let dependencyTaskMock: jest.Mocked<UnknownTask<unknown>>;
      let dependencyTaskMockStatus: TaskStatus;

      beforeAll(() => {
        dependencyTaskResult = Symbol();

        dependencyTaskMock = {
          kind: Symbol(),
          perform: jest.fn(),
          result: undefined,
          get status(): TaskStatus {
            return dependencyTaskMockStatus;
          },
        };

        dependencyNodeFixture = {
          dependencies: undefined,
          element: dependencyTaskMock,
        };
      });

      describe.each<[string, NodeDependenciesType]>([
        ['with an and dependency', NodeDependenciesType.and],
        ['with an bitwiseOr dependency', NodeDependenciesType.bitwiseOr],
      ])(
        'having a graph with a root node %s',
        (_: string, nodeDependencyType: NodeDependenciesType) => {
          let graphFixture: RootedGraph<UnknownTask<unknown>>;
          let nodeFixture: Node<UnknownTask<unknown>>;

          let taskResult: unknown;
          let taskMock: jest.Mocked<UnknownTask<unknown>>;
          let taskMockStatus: TaskStatus;

          beforeAll(() => {
            taskResult = Symbol();

            taskMock = {
              kind: Symbol(),
              perform: jest.fn(),
              result: undefined,
              get status(): TaskStatus {
                return taskMockStatus;
              },
            };

            nodeFixture = {
              dependencies: {
                nodes: [dependencyNodeFixture],
                type: nodeDependencyType,
              },
              element: taskMock,
            };

            graphFixture = {
              nodes: [nodeFixture, dependencyNodeFixture],
              root: nodeFixture,
            };
          });

          describe('when called', () => {
            let result: unknown;

            beforeAll(() => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;

              dependencyTaskMock.perform.mockImplementationOnce(() => {
                dependencyTaskMockStatus = TaskStatus.Ended;

                return dependencyTaskResult;
              });

              taskMockStatus = TaskStatus.NotStarted;

              taskMock.perform.mockImplementationOnce(() => {
                taskMockStatus = TaskStatus.Ended;

                return taskResult;
              });

              result = rootedTaskGraphRunner.run(graphFixture);
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call rootTask.perform', () => {
              expect(taskMock.perform).toHaveBeenCalledTimes(1);
              expect(taskMock.perform).toHaveBeenCalledWith(
                dependencyTaskResult,
              );
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should return a result', () => {
              expect(result).toBe(taskResult);
            });
          });

          describe('when called, and dependencyTask returns a promise', () => {
            let result: unknown;

            beforeAll(async () => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;

              dependencyTaskMock.perform.mockImplementationOnce(async () => {
                dependencyTaskMockStatus = TaskStatus.Ended;

                return dependencyTaskResult;
              });

              taskMockStatus = TaskStatus.NotStarted;

              taskMock.perform.mockImplementationOnce(() => {
                taskMockStatus = TaskStatus.Ended;

                return taskResult;
              });

              result = await rootedTaskGraphRunner.run(graphFixture);
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call rootTask.perform', () => {
              expect(taskMock.perform).toHaveBeenCalledTimes(1);
              expect(taskMock.perform).toHaveBeenCalledWith(
                dependencyTaskResult,
              );
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should return a result', () => {
              expect(result).toBe(taskResult);
            });
          });

          describe('when called, and dependencyTask throws an error', () => {
            let result: unknown;

            beforeAll(() => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;

              dependencyTaskMock.perform.mockImplementationOnce(() => {
                throw new Error();
              });

              try {
                rootedTaskGraphRunner.run(graphFixture);
              } catch (error: unknown) {
                result = error;
              }
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should not call rootTask.perform', () => {
              expect(taskMock.perform).not.toHaveBeenCalled();
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should throw an error', () => {
              expect(result).toBeInstanceOf(Error);
              expect(result).toStrictEqual(
                expect.objectContaining<Partial<Error>>({
                  message: 'Unable to recover from at least one task failure',
                }),
              );
            });
          });

          describe('when called, and dependencyTask returns a rejected promise', () => {
            let result: unknown;

            beforeAll(async () => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;

              dependencyTaskMock.perform.mockImplementationOnce(async () => {
                throw new Error();
              });

              try {
                await rootedTaskGraphRunner.run(graphFixture);
              } catch (error: unknown) {
                result = error;
              }
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should not call rootTask.perform', () => {
              expect(taskMock.perform).not.toHaveBeenCalled();
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should throw an error', () => {
              expect(result).toBeInstanceOf(Error);
              expect(result).toStrictEqual(
                expect.objectContaining<Partial<Error>>({
                  message: 'Unable to recover from at least one task failure',
                }),
              );
            });
          });
        },
      );

      describe('having a second dependency node', () => {
        let secondDependencyNodeFixture: Node<UnknownTask<unknown>>;

        let secondDependencyTaskResult: unknown;
        let secondDependencyTaskMock: jest.Mocked<UnknownTask<unknown>>;
        let secondDependencyTaskMockStatus: TaskStatus;

        beforeAll(() => {
          secondDependencyTaskResult = Symbol();

          secondDependencyTaskMock = {
            kind: Symbol(),
            perform: jest.fn(),
            result: undefined,
            get status(): TaskStatus {
              return secondDependencyTaskMockStatus;
            },
          };

          secondDependencyNodeFixture = {
            dependencies: undefined,
            element: secondDependencyTaskMock,
          };
        });

        describe('having a graph with a root node with an and dependency', () => {
          let graphFixture: RootedGraph<UnknownTask<unknown>>;
          let nodeFixture: Node<UnknownTask<unknown>>;

          let taskResult: unknown;
          let taskMock: jest.Mocked<UnknownTask<unknown>>;
          let taskMockStatus: TaskStatus;

          beforeAll(() => {
            taskResult = Symbol();

            taskMock = {
              kind: Symbol(),
              perform: jest.fn(),
              result: undefined,
              get status(): TaskStatus {
                return taskMockStatus;
              },
            };

            nodeFixture = {
              dependencies: {
                nodes: [dependencyNodeFixture, secondDependencyNodeFixture],
                type: NodeDependenciesType.and,
              },
              element: taskMock,
            };

            graphFixture = {
              nodes: [
                nodeFixture,
                dependencyNodeFixture,
                secondDependencyNodeFixture,
              ],
              root: nodeFixture,
            };
          });

          describe('when called, and taskDependency returns a promise', () => {
            let result: unknown;

            beforeAll(async () => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;
              dependencyTaskMock.perform.mockImplementationOnce(async () => {
                dependencyTaskMockStatus = TaskStatus.Ended;

                return dependencyTaskResult;
              });

              secondDependencyTaskMockStatus = TaskStatus.NotStarted;
              secondDependencyTaskMock.perform.mockImplementationOnce(() => {
                secondDependencyTaskMockStatus = TaskStatus.Ended;

                return secondDependencyTaskResult;
              });

              taskMockStatus = TaskStatus.NotStarted;
              taskMock.perform.mockImplementationOnce(() => {
                taskMockStatus = TaskStatus.Ended;

                return taskResult;
              });

              result = await rootedTaskGraphRunner.run(graphFixture);
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call rootTask.perform', () => {
              expect(taskMock.perform).toHaveBeenCalledTimes(1);
              expect(taskMock.perform).toHaveBeenCalledWith(
                dependencyTaskResult,
                secondDependencyTaskResult,
              );
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should call secondDependencyTask.perform', () => {
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should return a result', () => {
              expect(result).toBe(taskResult);
            });
          });

          describe('when called, and taskDependency returns a promise and secondTaskDependency throws an error', () => {
            let result: unknown;

            beforeAll(async () => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;
              dependencyTaskMock.perform.mockImplementationOnce(async () => {
                dependencyTaskMockStatus = TaskStatus.Ended;

                return dependencyTaskResult;
              });

              secondDependencyTaskMockStatus = TaskStatus.NotStarted;
              secondDependencyTaskMock.perform.mockImplementationOnce(() => {
                throw new Error();
              });

              try {
                await rootedTaskGraphRunner.run(graphFixture);
              } catch (error: unknown) {
                result = error;
              }
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should not call rootTask.perform', () => {
              expect(taskMock.perform).not.toHaveBeenCalled();
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should call secondDependencyTask.perform', () => {
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should throw an error', () => {
              expect(result).toBeInstanceOf(Error);
              expect(result).toStrictEqual(
                expect.objectContaining<Partial<Error>>({
                  message: 'Unable to recover from at least one task failure',
                }),
              );
            });
          });
        });

        describe('having a graph with a root node with an bitwiseOr dependency', () => {
          let graphFixture: RootedGraph<UnknownTask<unknown>>;
          let nodeFixture: Node<UnknownTask<unknown>>;

          let taskResult: unknown;
          let taskMock: jest.Mocked<UnknownTask<unknown>>;
          let taskMockStatus: TaskStatus;

          beforeAll(() => {
            taskResult = Symbol();

            taskMock = {
              kind: Symbol(),
              perform: jest.fn(),
              result: undefined,
              get status(): TaskStatus {
                return taskMockStatus;
              },
            };

            nodeFixture = {
              dependencies: {
                nodes: [dependencyNodeFixture, secondDependencyNodeFixture],
                type: NodeDependenciesType.bitwiseOr,
              },
              element: taskMock,
            };

            graphFixture = {
              nodes: [
                nodeFixture,
                dependencyNodeFixture,
                secondDependencyNodeFixture,
              ],
              root: nodeFixture,
            };
          });

          describe('when called, and taskDependency returns a rejected promise', () => {
            let result: unknown;

            beforeAll(async () => {
              dependencyTaskMockStatus = TaskStatus.NotStarted;
              dependencyTaskMock.perform.mockImplementationOnce(async () => {
                throw new Error();
              });

              secondDependencyTaskMockStatus = TaskStatus.NotStarted;
              secondDependencyTaskMock.perform.mockImplementationOnce(() => {
                secondDependencyTaskMockStatus = TaskStatus.Ended;

                return secondDependencyTaskResult;
              });

              taskMockStatus = TaskStatus.NotStarted;
              taskMock.perform.mockImplementationOnce(() => {
                taskMockStatus = TaskStatus.Ended;

                return taskResult;
              });

              result = await rootedTaskGraphRunner.run(graphFixture);
            });

            afterAll(() => {
              jest.clearAllMocks();
            });

            it('should call rootTask.perform', () => {
              expect(taskMock.perform).toHaveBeenCalledTimes(1);
              expect(taskMock.perform).toHaveBeenCalledWith(
                secondDependencyTaskResult,
              );
            });

            it('should call dependencyTask.perform', () => {
              expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should call secondDependencyTask.perform', () => {
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledTimes(1);
              expect(secondDependencyTaskMock.perform).toHaveBeenCalledWith();
            });

            it('should return a result', () => {
              expect(result).toBe(taskResult);
            });
          });
        });
      });
    });
  });
});
