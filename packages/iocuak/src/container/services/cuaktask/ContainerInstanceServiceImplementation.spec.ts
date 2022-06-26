import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { BindingTag } from '../../../binding/models/domain/BindingTag';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { CreateInstanceRootTaskKindFixtures } from '../../../createInstanceTask/fixtures/domain/CreateInstanceRootTaskKindFixtures';
import { CreateTagInstancesRootTaskKindFixtures } from '../../../createInstanceTask/fixtures/domain/CreateTagInstancesRootTaskKindFixtures';
import { TaskKind } from '../../../createInstanceTask/models/domain/TaskKind';
import { ContainerRequestService } from '../domain/ContainerRequestService';
import { ContainerInstanceServiceImplementation } from './ContainerInstanceServiceImplementation';

describe(ContainerInstanceServiceImplementation.name, () => {
  let containerRequestService: jestMock.Mocked<ContainerRequestService>;
  let rootedTaskGraphRunner: jestMock.Mocked<cuaktask.RootedTaskGraphRunner>;
  let taskGraphEngine: jestMock.Mocked<cuaktask.TaskGraphEngine<TaskKind>>;

  let containerInstanceServiceImplementation: ContainerInstanceServiceImplementation;

  beforeAll(() => {
    containerRequestService = {
      end: jest.fn(),
      start: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerRequestService>
    > as jestMock.Mocked<ContainerRequestService>;

    rootedTaskGraphRunner = {
      run: jest.fn(),
    } as Partial<
      jestMock.Mocked<cuaktask.RootedTaskGraphRunner>
    > as jestMock.Mocked<cuaktask.RootedTaskGraphRunner>;

    taskGraphEngine = {
      create: jest.fn(),
    };

    containerInstanceServiceImplementation =
      new ContainerInstanceServiceImplementation(
        containerRequestService,
        rootedTaskGraphRunner,
        taskGraphEngine,
      );
  });

  describe('.create', () => {
    describe('when called', () => {
      let requestIdFixture: symbol;
      let serviceIdFixture: ServiceId;
      let taskKindFixture: TaskKind;
      let graphFixture: cuaktask.RootedGraph<cuaktask.Task<TaskKind>>;
      let nodeFixture: cuaktask.Node<cuaktask.Task<TaskKind>>;
      let instanceFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        taskKindFixture = CreateInstanceRootTaskKindFixtures.any;
        requestIdFixture = taskKindFixture.requestId;
        serviceIdFixture = taskKindFixture.id;

        const taskMockStatus: cuaktask.TaskStatus =
          cuaktask.TaskStatus.NotStarted;

        nodeFixture = {
          dependencies: undefined,
          element: {
            kind: taskKindFixture,
            perform: jest.fn(),
            result: undefined,
            get status(): cuaktask.TaskStatus {
              return taskMockStatus;
            },
          },
        };

        graphFixture = {
          nodes: new Set([nodeFixture]),
          root: nodeFixture,
        };

        instanceFixture = { foo: 'bar' };

        containerRequestService.start.mockReturnValueOnce(requestIdFixture);
        taskGraphEngine.create.mockReturnValueOnce(graphFixture);
        rootedTaskGraphRunner.run.mockReturnValueOnce(instanceFixture);

        result =
          containerInstanceServiceImplementation.create(serviceIdFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerRequestService.start()', () => {
        expect(containerRequestService.start).toHaveBeenCalledTimes(1);
        expect(containerRequestService.start).toHaveBeenCalledWith();
      });

      it('should call taskGraphEngine.create()', () => {
        expect(taskGraphEngine.create).toHaveBeenCalledTimes(1);
        expect(taskGraphEngine.create).toHaveBeenCalledWith(taskKindFixture);
      });

      it('should call containerRequestService.end()', () => {
        expect(containerRequestService.end).toHaveBeenCalledTimes(1);
        expect(containerRequestService.end).toHaveBeenCalledWith(
          requestIdFixture,
        );
      });

      it('should call rootedTaskGraphRunner.run()', () => {
        expect(rootedTaskGraphRunner.run).toHaveBeenCalledTimes(1);
        expect(rootedTaskGraphRunner.run).toHaveBeenCalledWith(graphFixture);
      });

      it('should return an instance', () => {
        expect(result).toBe(instanceFixture);
      });
    });
  });

  describe('.createByTag', () => {
    describe('when called', () => {
      let requestIdFixture: symbol;
      let bindingTagFixture: BindingTag;
      let taskKindFixture: TaskKind;
      let graphFixture: cuaktask.RootedGraph<cuaktask.Task<TaskKind>>;
      let nodeFixture: cuaktask.Node<cuaktask.Task<TaskKind>>;
      let instancesFixture: unknown[];

      let result: unknown;

      beforeAll(() => {
        taskKindFixture = CreateTagInstancesRootTaskKindFixtures.any;
        requestIdFixture = taskKindFixture.requestId;
        bindingTagFixture = taskKindFixture.tag;

        const taskMockStatus: cuaktask.TaskStatus =
          cuaktask.TaskStatus.NotStarted;

        nodeFixture = {
          dependencies: undefined,
          element: {
            kind: taskKindFixture,
            perform: jest.fn(),
            result: undefined,
            get status(): cuaktask.TaskStatus {
              return taskMockStatus;
            },
          },
        };

        graphFixture = {
          nodes: new Set([nodeFixture]),
          root: nodeFixture,
        };

        instancesFixture = [{ foo: 'bar' }];

        containerRequestService.start.mockReturnValueOnce(requestIdFixture);
        taskGraphEngine.create.mockReturnValueOnce(graphFixture);
        rootedTaskGraphRunner.run.mockReturnValueOnce(instancesFixture);

        result =
          containerInstanceServiceImplementation.createByTag(bindingTagFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call containerRequestService.start()', () => {
        expect(containerRequestService.start).toHaveBeenCalledTimes(1);
        expect(containerRequestService.start).toHaveBeenCalledWith();
      });

      it('should call taskGraphEngine.create()', () => {
        expect(taskGraphEngine.create).toHaveBeenCalledTimes(1);
        expect(taskGraphEngine.create).toHaveBeenCalledWith(taskKindFixture);
      });

      it('should call containerRequestService.end()', () => {
        expect(containerRequestService.end).toHaveBeenCalledTimes(1);
        expect(containerRequestService.end).toHaveBeenCalledWith(
          requestIdFixture,
        );
      });

      it('should call rootedTaskGraphRunner.run()', () => {
        expect(rootedTaskGraphRunner.run).toHaveBeenCalledTimes(1);
        expect(rootedTaskGraphRunner.run).toHaveBeenCalledWith(graphFixture);
      });

      it('should return an instance', () => {
        expect(result).toBe(instancesFixture);
      });
    });
  });
});
