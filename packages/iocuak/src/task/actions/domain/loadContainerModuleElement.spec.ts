import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./loadFromContainerModuleClassMetadata');
jest.mock('./loadFromContainerModuleFactoryMetadata');

import { ContainerModuleMetadataMocks } from '../../../containerModuleMetadata/mocks/models/domain/ContainerModuleMetadataMocks';
import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { TaskContext } from '../../models/domain/TaskContext';
import { loadContainerModuleElement } from './loadContainerModuleElement';
import { loadFromContainerModuleClassMetadata } from './loadFromContainerModuleClassMetadata';
import { loadFromContainerModuleFactoryMetadata } from './loadFromContainerModuleFactoryMetadata';

describe(loadContainerModuleElement.name, () => {
  describe('having a ContainerModuleMetadata of type class', () => {
    let containerModuleMetadataFixture: ContainerModuleMetadata;

    beforeAll(() => {
      containerModuleMetadataFixture =
        ContainerModuleMetadataMocks.withTypeClazz;
    });

    describe('when called', () => {
      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = {
          [Symbol()]: Symbol(),
        } as unknown as TaskContext;

        result = loadContainerModuleElement(
          containerModuleMetadataFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call loadFromContainerModuleClassMetadata()', () => {
        expect(loadFromContainerModuleClassMetadata).toHaveBeenCalledTimes(1);
        expect(loadFromContainerModuleClassMetadata).toHaveBeenCalledWith(
          containerModuleMetadataFixture,
          taskContextFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a ContainerModuleMetadata of type factory', () => {
    let containerModuleMetadataFixture: ContainerModuleMetadata;

    beforeAll(() => {
      containerModuleMetadataFixture =
        ContainerModuleMetadataMocks.withTypeFactory;
    });

    describe('when called', () => {
      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
        taskContextFixture = {
          [Symbol()]: Symbol(),
        } as unknown as TaskContext;

        result = loadContainerModuleElement(
          containerModuleMetadataFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call loadFromContainerModuleFactoryMetadata()', () => {
        expect(loadFromContainerModuleFactoryMetadata).toHaveBeenCalledTimes(1);
        expect(loadFromContainerModuleFactoryMetadata).toHaveBeenCalledWith(
          containerModuleMetadataFixture,
          taskContextFixture,
        );
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });
});
