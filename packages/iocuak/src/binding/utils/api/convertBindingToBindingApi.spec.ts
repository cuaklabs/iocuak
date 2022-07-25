import { beforeAll, describe, expect, it } from '@jest/globals';

import { TypeBinding, ValueBinding } from '@cuaklabs/iocuak-binding';

import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../fixtures/domain/ValueBindingFixtures';
import { BindingApi } from '../../models/api/BindingApi';
import { BindingScopeApi } from '../../models/api/BindingScopeApi';
import { bindingScopeToBindingScopeApiMap } from '../../models/api/bindingScopeToBindingScopeApiMap';
import { BindingTypeApi } from '../../models/api/BindingTypeApi';
import { convertBindingToBindingApi } from './convertBindingToBindingApi';

describe(convertBindingToBindingApi.name, () => {
  describe('having a type binding', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = TypeBindingFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(bindingFixture);
      });

      it('should return a bindingApi', () => {
        const expectedScope: BindingScopeApi =
          bindingScopeToBindingScopeApiMap[bindingFixture.scope];

        const expected: BindingApi = {
          bindingType: BindingTypeApi.type,
          id: bindingFixture.id,
          scope: expectedScope,
          tags: [...bindingFixture.tags],
          type: bindingFixture.type,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a value binding', () => {
    let bindingFixture: ValueBinding;

    beforeAll(() => {
      bindingFixture = ValueBindingFixtures.any;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(bindingFixture);
      });

      it('should return a bindingApi', () => {
        const expected: BindingApi = {
          bindingType: BindingTypeApi.value,
          id: bindingFixture.id,
          tags: [...bindingFixture.tags],
          value: bindingFixture.value,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
