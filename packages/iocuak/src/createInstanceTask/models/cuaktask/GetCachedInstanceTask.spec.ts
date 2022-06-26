import { TaskStatus } from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { GetCachedInstanceTaskKindFixtures } from '../../fixtures/domain/GetCachedInstanceTaskKindFixtures';
import { GetCachedInstanceTaskKind } from '../domain/GetCachedInstanceTaskKind';
import { GetCachedInstanceTask } from './GetCachedInstanceTask';

describe(GetCachedInstanceTask.name, () => {
  let containerRequestServiceMock: jestMock.Mocked<ContainerRequestService>;
  let containerSingletonServiceMock: jestMock.Mocked<ContainerSingletonService>;

  beforeAll(() => {
    containerRequestServiceMock = {
      get: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerRequestService>
    > as jestMock.Mocked<ContainerRequestService>;

    containerSingletonServiceMock = {
      get: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerSingletonService>
    > as jestMock.Mocked<ContainerSingletonService>;
  });

  describe('.perform', () => {
    describe('having a GetCachedInstanceTaskKind with binding TypeBinding with scope request', () => {
      let bindingFixture: TypeBinding;
      let taskKindFixture: GetCachedInstanceTaskKind;

      beforeAll(() => {
        const instanceConstructorCallMock: jestMock.Mock<
          (...params: unknown[]) => unknown
        > = jest.fn().mockImplementation(() => ({ foo: 'bar' }));

        bindingFixture = {
          ...TypeBindingFixtures.withScopeRequest,
          type: instanceConstructorCallMock,
        };
        taskKindFixture = {
          ...GetCachedInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called, and containerRequestService.get() returns an instance', () => {
        let getCachedInstanceTask: GetCachedInstanceTask;
        let cachedInstanceFixture: unknown;
        let result: unknown;

        beforeAll(() => {
          cachedInstanceFixture = { foo: 'baz' };

          containerRequestServiceMock.get.mockReturnValueOnce(
            cachedInstanceFixture,
          );

          getCachedInstanceTask = new GetCachedInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = getCachedInstanceTask.perform();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerRequestService.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.binding.id,
          );
        });

        it('should return the cached fixture', () => {
          expect(result).toBe(cachedInstanceFixture);
        });

        describe('when called .status', () => {
          let result: unknown;

          beforeAll(() => {
            result = getCachedInstanceTask.status;
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return Ended', () => {
            expect(result).toBe(TaskStatus.Ended);
          });
        });
      });

      describe('when called, and containerRequestService.get() returns undefined', () => {
        let getCachedInstanceTask: GetCachedInstanceTask;
        let cachedInstanceFixture: undefined;
        let result: unknown;

        beforeAll(() => {
          cachedInstanceFixture = undefined;

          containerRequestServiceMock.get.mockReturnValueOnce(
            cachedInstanceFixture,
          );

          getCachedInstanceTask = new GetCachedInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = getCachedInstanceTask.perform();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerRequestService.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.binding.id,
          );
        });

        it('should return the cached fixture', () => {
          expect(result).toBe(cachedInstanceFixture);
        });

        describe('when called .status', () => {
          let result: unknown;

          beforeAll(() => {
            result = getCachedInstanceTask.status;
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return Error', () => {
            expect(result).toBe(TaskStatus.Error);
          });
        });
      });
    });

    describe('having a GetCachedInstanceTaskKind with binding TypeBinding with scope singleton', () => {
      let bindingFixture: TypeBinding;
      let taskKindFixture: GetCachedInstanceTaskKind;

      beforeAll(() => {
        const instanceConstructorCallMock: jestMock.Mock<
          (...params: unknown[]) => unknown
        > = jest.fn().mockImplementation(() => ({ foo: 'bar' }));

        bindingFixture = {
          ...TypeBindingFixtures.withScopeSingleton,
          type: instanceConstructorCallMock,
        };
        taskKindFixture = {
          ...GetCachedInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called, and containerSingletonService.get() returns an instance', () => {
        let getCachedInstanceTask: GetCachedInstanceTask;
        let cachedInstanceFixture: unknown;
        let result: unknown;

        beforeAll(() => {
          cachedInstanceFixture = { foo: 'baz' };

          containerSingletonServiceMock.get.mockReturnValueOnce(
            cachedInstanceFixture,
          );

          getCachedInstanceTask = new GetCachedInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = getCachedInstanceTask.perform();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerSingletonService.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.binding.id,
          );
        });

        it('should return the cached fixture', () => {
          expect(result).toBe(cachedInstanceFixture);
        });

        describe('when called .status', () => {
          let result: unknown;

          beforeAll(() => {
            result = getCachedInstanceTask.status;
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return Ended', () => {
            expect(result).toBe(TaskStatus.Ended);
          });
        });
      });

      describe('when called, and containerSingletonService.get() returns undefined', () => {
        let getCachedInstanceTask: GetCachedInstanceTask;
        let cachedInstanceFixture: undefined;
        let result: unknown;

        beforeAll(() => {
          cachedInstanceFixture = undefined;

          containerSingletonServiceMock.get.mockReturnValueOnce(
            cachedInstanceFixture,
          );

          getCachedInstanceTask = new GetCachedInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = getCachedInstanceTask.perform();
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerSingletonService.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.binding.id,
          );
        });

        it('should return the cached fixture', () => {
          expect(result).toBe(cachedInstanceFixture);
        });

        describe('when called .status', () => {
          let result: unknown;

          beforeAll(() => {
            result = getCachedInstanceTask.status;
          });

          afterAll(() => {
            jest.clearAllMocks();
          });

          it('should return Error', () => {
            expect(result).toBe(TaskStatus.Error);
          });
        });
      });
    });
  });
});
