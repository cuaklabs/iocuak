import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { Handler } from '../../../common/modules/domain/Handler';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { CreateCreateTypeBindingInstanceTaskNodeCommand } from '../../models/cuaktask/CreateCreateTypeBindingInstanceTaskNodeCommand';
import { CreateInstanceTaskNodeFromTaskKindExpandOperationContext } from '../../models/cuaktask/CreateInstanceTaskNodeFromTaskKindExpandOperationContext';
import { CreateInstanceTaskKind } from '../../models/domain/CreateInstanceTaskKind';
import { TaskKind } from '../../models/domain/TaskKind';
import { CreateCreateInstanceTaskNodeCommandHandler } from './CreateCreateInstanceTaskNodeCommandHandler';

describe(CreateCreateInstanceTaskNodeCommandHandler.name, () => {
  let containerRequestServiceFixture: ContainerRequestService;
  let containerSingletonServiceFixture: ContainerSingletonService;
  let createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock: jestMock.Mocked<
    Handler<
      CreateCreateTypeBindingInstanceTaskNodeCommand,
      cuaktask.NodeDependency<cuaktask.Task<TaskKind, unknown[], unknown>>
    >
  >;

  let createCreateInstanceTaskGraphNodeCommandHandler: CreateCreateInstanceTaskNodeCommandHandler;

  beforeAll(() => {
    containerRequestServiceFixture = {
      _type: Symbol(),
    } as unknown as ContainerRequestService;
    containerSingletonServiceFixture = {
      _type: Symbol(),
    } as unknown as ContainerSingletonService;
    createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock = {
      handle: jest.fn(),
    };

    createCreateInstanceTaskGraphNodeCommandHandler =
      new CreateCreateInstanceTaskNodeCommandHandler(
        containerRequestServiceFixture,
        containerSingletonServiceFixture,
        createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock,
      );
  });

  describe('.handle', () => {
    describe('having a CreateCreateTypeBindingInstanceTaskGraphNodeCommand', () => {
      let createCreateTypeBindingInstanceTaskGraphNodeCommandFixture: CreateCreateTypeBindingInstanceTaskNodeCommand;

      beforeAll(() => {
        createCreateTypeBindingInstanceTaskGraphNodeCommandFixture = {
          context: {
            taskKind: CreateInstanceTaskKindFixtures.withBindingType,
          } as Partial<
            CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
              CreateInstanceTaskKind<TypeBinding>
            >
          > as CreateInstanceTaskNodeFromTaskKindExpandOperationContext<
            CreateInstanceTaskKind<TypeBinding>
          >,
        };
      });

      describe('when called', () => {
        let nodeDependencyFixture: cuaktask.NodeDependency<
          cuaktask.Task<TaskKind>
        >;

        let result: unknown;

        beforeAll(() => {
          nodeDependencyFixture = {
            nodes: [],
            type: cuaktask.NodeDependenciesType.and,
          };

          createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock.handle.mockReturnValueOnce(
            nodeDependencyFixture,
          );

          result = createCreateInstanceTaskGraphNodeCommandHandler.handle(
            createCreateTypeBindingInstanceTaskGraphNodeCommandFixture,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call createCreateTypeBindingInstanceTaskGraphNodeCommandHandler.handle()', () => {
          expect(
            createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock.handle,
          ).toHaveBeenCalledTimes(1);
          expect(
            createCreateTypeBindingInstanceTaskGraphNodeCommandHandlerMock.handle,
          ).toHaveBeenCalledWith(
            createCreateTypeBindingInstanceTaskGraphNodeCommandFixture,
          );
        });

        it('should return a node dependency', () => {
          expect(result).toBe(nodeDependencyFixture);
        });
      });
    });
  });
});
