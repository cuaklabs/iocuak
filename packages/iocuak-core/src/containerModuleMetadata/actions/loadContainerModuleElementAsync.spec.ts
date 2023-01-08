import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./loadContainerModuleElement');

import { ContainerModuleMetadata } from '../../containerModuleMetadata/models/ContainerModuleMetadata';
import { LoadModuleMetadataTaskContext } from '../models/LoadModuleMetadataTaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';
import { loadContainerModuleElementAsync } from './loadContainerModuleElementAsync';

describe(loadContainerModuleElementAsync.name, () => {
  describe('when called', () => {
    let containerModuleMetadataFixture: ContainerModuleMetadata;
    let taskContextFixture: LoadModuleMetadataTaskContext;
    let loadModuleDependenciesResultFixture: Promise<void>;

    let result: unknown;

    beforeAll(async () => {
      containerModuleMetadataFixture = {
        [Symbol()]: Symbol(),
      } as unknown as ContainerModuleMetadata;

      taskContextFixture = {
        [Symbol()]: Symbol(),
      } as unknown as LoadModuleMetadataTaskContext;

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
