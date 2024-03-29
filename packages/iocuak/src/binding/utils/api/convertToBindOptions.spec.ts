import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindOptionsApi } from '@cuaklabs/iocuak-models-api';

import { BindOptionsApiFixtures } from '../../fixtures/api/BindOptionsApiFixtures';
import { BindOptionsFixtures } from '../../fixtures/domain/BindOptionsFixtures';
import { convertToBindOptions } from './convertToBindOptions';

describe(convertToBindOptions.name, () => {
  describe('having BindingOptionsApi', () => {
    let bindingOptionsApiFixture: BindOptionsApi;

    beforeAll(() => {
      bindingOptionsApiFixture = BindOptionsApiFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToBindOptions(bindingOptionsApiFixture);
      });

      it('should resturn BindingOptions', () => {
        expect(result).toStrictEqual(BindOptionsFixtures.any);
      });
    });
  });

  describe('having BindingOptionsApi undefined', () => {
    let bindingOptionsApiFixture: undefined;

    beforeAll(() => {
      bindingOptionsApiFixture = undefined;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToBindOptions(bindingOptionsApiFixture);
      });

      it('should resturn BindingOptions', () => {
        expect(result).toStrictEqual(BindOptionsFixtures.withScopeUndefined);
      });
    });
  });

  describe('having BindingOptionsApi with no scope', () => {
    let bindingOptionsApiFixture: BindOptionsApi;

    beforeAll(() => {
      bindingOptionsApiFixture = BindOptionsApiFixtures.withNoScope;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToBindOptions(bindingOptionsApiFixture);
      });

      it('should resturn BindingOptions', () => {
        expect(result).toStrictEqual(BindOptionsFixtures.withScopeUndefined);
      });
    });
  });
});
