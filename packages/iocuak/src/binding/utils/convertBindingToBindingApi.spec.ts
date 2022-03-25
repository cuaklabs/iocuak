import { TaskScopeApi } from '../../task/models/api/TaskScopeApi';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { BindingApi } from '../models/api/BindingApi';
import { BindingApiType } from '../models/api/BindingApiType';
import { BindingType } from '../models/domain/BindingType';
import { TypeBinding } from '../models/domain/TypeBinding';
import { ValueBinding } from '../models/domain/ValueBinding';
import { convertBindingToBindingApi } from './convertBindingToBindingApi';

describe(convertBindingToBindingApi.name, () => {
  describe('having a type binding', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = {
        bindingType: BindingType.type,
        id: 'service-id',
        scope: TaskScope.transient,
        type: class {},
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(bindingFixture);
      });

      it('should return a bindingApi', () => {
        const expected: BindingApi = {
          bindingType: BindingApiType.type,
          id: bindingFixture.id,
          scope: TaskScopeApi.transient,
          type: bindingFixture.type,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('having a value binding', () => {
    let bindingFixture: ValueBinding;

    beforeAll(() => {
      bindingFixture = {
        bindingType: BindingType.value,
        id: 'service-id',
        value: {
          foo: 'bar',
        },
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = convertBindingToBindingApi(bindingFixture);
      });

      it('should return a bindingApi', () => {
        const expected: BindingApi = {
          bindingType: BindingApiType.value,
          id: bindingFixture.id,
          value: bindingFixture.value,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });
});
