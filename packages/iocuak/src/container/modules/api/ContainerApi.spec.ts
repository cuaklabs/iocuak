import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../../binding/services/domain/BindingServiceImplementation');
jest.mock('../../../metadata/services/domain/MetadataServiceImplementation');
jest.mock('../../services/domain/ContainerRequestServiceImplementation');
jest.mock('../../services/domain/ContainerSingletonServiceImplementation');

import { BindingServiceImplementation } from '../../../binding/services/domain/BindingServiceImplementation';
import { Newable } from '../../../common/models/domain/Newable';
import { MetadataServiceImplementation } from '../../../metadata/services/domain/MetadataServiceImplementation';
import { ContainerRequestServiceImplementation } from '../../services/domain/ContainerRequestServiceImplementation';
import { ContainerSingletonServiceImplementation } from '../../services/domain/ContainerSingletonServiceImplementation';
import { ContainerApi } from './ContainerApi';

let currentLabel: number = 0;

function buildEmptyFixture<T>(): T {
  return {
    _label: currentLabel++,
  } as unknown as T;
}

function bindFixtureToConstructor<T>(
  constructor: Newable<T>,
  fixture: T,
): void {
  (
    constructor as unknown as jestMock.Mock<Newable<T> & jestMock.FunctionLike>
  ).mockReturnValue(fixture);
}

describe(ContainerApi.name, () => {
  describe('.build', () => {
    describe('when called', () => {
      let containerBindingServiceImplementationFixture: BindingServiceImplementation;
      let metadataServiceImplementationFixture: MetadataServiceImplementation;
      let containerRequestServiceImplementationFixture: ContainerRequestServiceImplementation;
      let containerSingletonServiceImplementationFixture: ContainerSingletonServiceImplementation;

      let result: unknown;

      beforeAll(() => {
        containerBindingServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          BindingServiceImplementation,
          containerBindingServiceImplementationFixture,
        );

        metadataServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          MetadataServiceImplementation,
          metadataServiceImplementationFixture,
        );

        containerRequestServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerRequestServiceImplementation,
          containerRequestServiceImplementationFixture,
        );

        containerSingletonServiceImplementationFixture = buildEmptyFixture();
        bindFixtureToConstructor(
          ContainerSingletonServiceImplementation,
          containerSingletonServiceImplementationFixture,
        );

        result = ContainerApi.build();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call new ContainerBindingServiceImplementation()', () => {
        expect(BindingServiceImplementation).toHaveBeenCalledTimes(1);
        expect(BindingServiceImplementation).toHaveBeenCalledWith(undefined);
      });

      it('should call new MetadataServiceImplementation()', () => {
        expect(MetadataServiceImplementation).toHaveBeenCalledTimes(1);
        expect(MetadataServiceImplementation).toHaveBeenCalledWith();
      });

      it('should call new ContainerRequestServiceImplementation()', () => {
        expect(ContainerRequestServiceImplementation).toHaveBeenCalledTimes(1);
        expect(ContainerRequestServiceImplementation).toHaveBeenCalledWith();
      });

      it('should call new ContainerSingletonServiceImplementation()', () => {
        expect(ContainerSingletonServiceImplementation).toHaveBeenCalledTimes(
          1,
        );
        expect(ContainerSingletonServiceImplementation).toHaveBeenCalledWith();
      });

      it('should return a ContainerApi', () => {
        expect(result).toBeInstanceOf(ContainerApi);
      });
    });
  });
});
