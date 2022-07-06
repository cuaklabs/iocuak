import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./loadContainerModuleElement');

import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { TaskContext } from '../../models/domain/TaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';
import { loadContainerModuleElementAsync } from './loadContainerModuleElementAsync';

describe(loadContainerModuleElementAsync.name, () => {
  describe('when called', () => {
    let containerModuleMetadataFixture: ContainerModuleMetadata;
    let taskContextFixture: TaskContext;
    let loadModuleDependenciesResultFixture: Promise<void>;

    let result: unknown;

    beforeAll(async () => {
      containerModuleMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ContainerModuleMetadata;

      taskContextFixture = {
        [Symbol()]: Symbol(),
      } as unknown as TaskContext;

      loadModuleDependenciesResultFixture = Promise.resolve();

      result = await loadContainerModuleElementAsync(
        containerModuleMetadataFixture,
        taskContextFixture,
        loadModuleDependenciesResultFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call loadContainerModuleElement()', () => {
      expect(loadContainerModuleElement).toHaveBeenCalledTimes(1);
      expect(loadContainerModuleElement).toHaveBeenCalledWith(
        containerModuleMetadataFixture,
        taskContextFixture,
      );
    });

    it('should return undefined', () => {
      expect(result).toBeUndefined();
    });
  });
});
