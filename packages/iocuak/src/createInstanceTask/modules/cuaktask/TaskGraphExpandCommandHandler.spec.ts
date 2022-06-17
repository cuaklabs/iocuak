import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { ReadOnlyLinkedListImplementation } from '../../../list/models/domain/ReadOnlyLinkedListImplementation';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { GetInstanceDependenciesTaskKindFixtures } from '../../fixtures/domain/GetInstanceDependenciesTaskKindFixtures';
import { CreateInstanceTask } from '../../models/cuaktask/CreateInstanceTask';
import { CreateInstanceTaskGraphExpandCommand } from '../../models/cuaktask/CreateInstanceTaskGraphExpandCommand';
import { GetInstanceDependenciesTask } from '../../models/cuaktask/GetInstanceDependenciesTask';
import { GetInstanceDependenciesTaskGraphExpandCommand } from '../../models/cuaktask/GetInstanceDependenciesTaskGraphExpandCommand';
import { TaskGraphExpandCommand } from '../../models/cuaktask/TaskGraphExpandCommand';
import { TaskGraphExpandCommandType } from '../../models/cuaktask/TaskGraphExpandCommandType';
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
    describe('having a createInstance task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand;

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
          taskKindType: TaskGraphExpandCommandType.createInstance,
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

    describe('having a getInstanceDependencies task graph expand command', () => {
      let taskGraphExpandCommandFixture: TaskGraphExpandCommand;

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
          taskKindType: TaskGraphExpandCommandType.getInstanceDependencies,
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
