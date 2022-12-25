import { beforeAll, describe, expect, it } from '@jest/globals';

import { TypeBinding, ValueBinding } from '@cuaklabs/iocuak-models';
import {
  BindingApi,
  BindingScopeApi,
  bindingScopeToBindingScopeApiMap,
  BindingTypeApi,
} from '@cuaklabs/iocuak-models-api';

import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../fixtures/domain/ValueBindingFixtures';
import { convertBindingToBindingApi } from './convertBindingToBindingApi';

describe(convertBindingToBindingApi.name, () => {
  describe.each<[string, TypeBinding]>([
    ['type binding', TypeBindingFixtures.any],
    ['type binding with tags', TypeBindingFixtures.withTagsOne],
  ])('having a %s', (_: string, typeBindingFixture: TypeBinding) => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(typeBindingFixture);
      });

      it('should return a bindingApi', () => {
        const expectedScope: BindingScopeApi =
          bindingScopeToBindingScopeApiMap[typeBindingFixture.scope];

        const expected: BindingApi = {
          bindingType: BindingTypeApi.type,
          id: typeBindingFixture.id,
          scope: expectedScope,
          tags: [...typeBindingFixture.tags],
          type: typeBindingFixture.type,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe.each<[string, ValueBinding]>([
    ['value binding', ValueBindingFixtures.any],
    ['value binding with tags', ValueBindingFixtures.withTagsOne],
  ])('having a %s', (_: string, valueBindingFixture: ValueBinding) => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(valueBindingFixture);
      });

      it('should return a bindingApi', () => {
        const expected: BindingApi = {
          bindingType: BindingTypeApi.value,
          id: valueBindingFixture.id,
          tags: [...valueBindingFixture.tags],
          value: valueBindingFixture.value,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
