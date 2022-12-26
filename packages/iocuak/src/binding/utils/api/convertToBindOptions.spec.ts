import { beforeAll, describe, expect, it } from '@jest/globals';

import { BindOptionsApi } from '@cuaklabs/iocuak-models-api';

import { BindingOptionsApiFixtures } from '../../fixtures/api/BindingOptionsApiFixtures';
import { BindingOptionsFixtures } from '../../fixtures/domain/BindingOptionsFixtures';
import { convertToBindOptions } from './convertToBindOptions';

describe(convertToBindOptions.name, () => {
  describe('having BindingOptionsApi', () => {
    let bindingOptionsApiFixture: BindOptionsApi;

    beforeAll(() => {
      bindingOptionsApiFixture = BindingOptionsApiFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToBindOptions(bindingOptionsApiFixture);
      });

      it('should resturn BindingOptions', () => {
        expect(result).toStrictEqual(BindingOptionsFixtures.any);
      });
    });
  });

  describe('having BindingOptionsApi with no scope', () => {
    let bindingOptionsApiFixture: BindOptionsApi;

    beforeAll(() => {
      bindingOptionsApiFixture = BindingOptionsApiFixtures.withNoScope;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertToBindOptions(bindingOptionsApiFixture);
      });

      it('should resturn BindingOptions', () => {
        expect(result).toStrictEqual(BindingOptionsFixtures.withScopeUndefined);
      });
    });
  });
});
