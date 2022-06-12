import * as cuaktask from '@cuaklabs/cuaktask';

import { TaskGraphExpandCommand } from '../../../common/models/cuaktask/TaskGraphExpandCommand';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { CreateInstanceTaskGraphExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskGraphExpandOperationContext';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskKindType } from '../../models/domain/TaskKindType';
import { TaskGraphExpandCommandHandler } from './TaskGraphExpandCommandHandler';

describe(TaskGraphExpandCommandHandler.name, () => {
  let createInstanceTaskGraphExpandCommandHandlerMock: jest.Mocked<
    Handler<CreateInstanceTaskGraphExpandCommand, void>
  >;
  let getInstanceDependenciesTaskGraphExpandCommandHandlerMock: jest.Mocked<
    Handler<GetInstanceDependenciesTaskGraphExpandCommand, void>
  >;

  let taskGraphExpandCommandHandler: TaskGraphExpandCommandHandler;

  beforeAll(() => {
    createInstanceTaskGraphExpandCommandHandlerMock = {
      handle: jest.fn(),
    };

    getInstanceDependenciesTaskGraphExpandCommandHandlerMock = {
      handle: jest.fn(),
    };

    taskGraphExpandCommandHandler = new TaskGraphExpandCommandHandler(
      createInstanceTaskGraphExpandCommandHandlerMock,
      getInstanceDependenciesTaskGraphExpandCommandHandlerMock,
    );
  });

  describe('.handle', () => {
    describe('having an invalid createInstance task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          node: {
            dependencies: undefined,
            element: {
              kind: Symbol(),
            },
          },
          taskKindType: TaskKindType.createInstance,
        } as Partial<
          TaskGraphExpandCommand<
            CreateInstanceTaskGraphExpandOperationContext,
            TaskKindType,
            cuaktask.Task<unknown>
          >
        > as TaskGraphExpandCommand<
          CreateInstanceTaskGraphExpandOperationContext,
          TaskKindType,
          cuaktask.Task<unknown>
        >;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            result = taskGraphExpandCommandHandler.handle(
              taskGraphExpandCommandFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Invalid createInstance task graph command',
            }),
          );
        });
      });
    });

    describe('having a createInstance task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          context: {
            graph: {
              nodes: new Set(),
            },
            serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
            serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
            serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
          },
          node: {
            dependencies: undefined,
            element: new CreateInstanceTask(
              CreateInstanceTaskKindFixtures.any,
              { _type: Symbol() } as unknown as ContainerRequestService,
              { _type: Symbol() } as unknown as ContainerSingletonService,
            ),
          },
          taskKindType: TaskKindType.createInstance,
        };
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = taskGraphExpandCommandHandler.handle(
            taskGraphExpandCommandFixture,
          );
        });

        it('should call createInstanceTaskGraphExpandCommandHandler.handle()', () => {
          expect(
            createInstanceTaskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            createInstanceTaskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledWith(taskGraphExpandCommandFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('having an invalid getInstanceDependencies task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          node: {
            dependencies: undefined,
            element: {
              kind: Symbol(),
            },
          },
          taskKindType: TaskKindType.getInstanceDependencies,
        } as Partial<
          TaskGraphExpandCommand<
            CreateInstanceTaskGraphExpandOperationContext,
            TaskKindType,
            cuaktask.Task<unknown>
          >
        > as TaskGraphExpandCommand<
          CreateInstanceTaskGraphExpandOperationContext,
          TaskKindType,
          cuaktask.Task<unknown>
        >;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          try {
            result = taskGraphExpandCommandHandler.handle(
              taskGraphExpandCommandFixture,
            );
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an error', () => {
          expect(result).toBeInstanceOf(Error);
          expect(result).toStrictEqual(
            expect.objectContaining<Partial<Error>>({
              message: 'Invalid getInstanceDependencies task graph command',
            }),
          );
        });
      });
    });

    describe('having a getInstanceDependencies task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand<
        CreateInstanceTaskGraphExpandOperationContext,
        TaskKindType,
        cuaktask.Task<unknown>
      >;

      beforeAll(() => {
        taskGraphExpandCommandFixture = {
          context: {
            graph: {
              nodes: new Set(),
            },
            serviceIdAncestorList: ReadOnlyLinkedListImplementation.build(),
            serviceIdToRequestCreateInstanceTaskKindNode: new Map(),
            serviceIdToSingletonCreateInstanceTaskKindNode: new Map(),
          },
          node: {
            dependencies: undefined,
            element: new GetInstanceDependenciesTask(
              GetInstanceDependenciesTaskKindFixtures.any,
            ),
          },
          taskKindType: TaskKindType.getInstanceDependencies,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = taskGraphExpandCommandHandler.handle(
            taskGraphExpandCommandFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call getInstanceDependenciesTaskGraphExpandCommandHandlerMock.handle()', () => {
          expect(
            getInstanceDependenciesTaskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            getInstanceDependenciesTaskGraphExpandCommandHandlerMock.handle,
          ).toHaveBeenCalledWith(taskGraphExpandCommandFixture);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });
  });
});
