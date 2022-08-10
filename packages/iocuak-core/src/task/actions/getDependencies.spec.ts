import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getDependency');

import { ClassMetadata } from '@cuaklabs/iocuak-models';

import { ClassMetadataFixtures } from '../../classMetadata/fixtures/ClassMetadataFixtures';
import { ServiceDependencies } from '../models/ServiceDependencies';
import { TaskContext } from '../models/TaskContext';
import { getDependencies } from './getDependencies';
import { getDependency } from './getDependency';

describe(getDependencies.name, () => {
  let classMetadataFixture: ClassMetadata;
  let taskContextFixture: TaskContext;

  beforeAll(() => {
    classMetadataFixture =
      ClassMetadataFixtures.withConstructorArgumentsServiceAndPropertiesService;

    taskContextFixture = {
      [Symbol()]: Symbol(),
    } as unknown as TaskContext;
  });

  describe('when called', () => {
    let constructorArgumentFixture: unknown;
    let propertyFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      constructorArgumentFixture = Symbol();
      propertyFixture = Symbol();

      (getDependency as jestMock.Mock<typeof getDependency>)
        .mockReturnValueOnce(constructorArgumentFixture)
        .mockReturnValueOnce(propertyFixture);

      result = getDependencies(classMetadataFixture, taskContextFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getDependency()', () => {
      expect(getDependency).toHaveBeenCalledTimes(2);
      expect(getDependency).toHaveBeenNthCalledWith(
        1,
        classMetadataFixture.constructorArguments[0],
        taskContextFixture,
      );
      expect(getDependency).toHaveBeenNthCalledWith(
        2,
        [...classMetadataFixture.properties.values()][0],
        taskContextFixture,
      );
    });

    it('should return a ServiceDependencies', () => {
      const expectedServiceDependencies: ServiceDependencies = {
        constructorArguments: [constructorArgumentFixture],
        properties: new Map([
          [
            [...classMetadataFixture.properties.keys()][0] as string | symbol,
            propertyFixture,
          ],
        ]),
      };

      expect(result).toStrictEqual(expectedServiceDependencies);
    });
  });
});
