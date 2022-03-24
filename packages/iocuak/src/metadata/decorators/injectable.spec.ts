import 'reflect-metadata';

import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { TaskScopeApi } from '../../task/models/api/TaskScopeApi';
import { taskScopeApiToTaskScopeMap } from '../../task/models/api/taskScopeApiToTaskScopeMap';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { InjectableOptionsApiFixtures } from '../fixtures/api/InjectableOptionsApiFixtures';
import { MetadataKey } from '../models/domain/MetadataKey';
import { injectable } from './injectable';

describe(injectable.name, () => {
  describe('when called, with no InjectableOptionsApi', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable()
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.injectable,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      expect(reflectMetadata).toStrictEqual<TypeBinding>({
        bindingType: BindingType.type,
        id: targetFixture,
        scope: TaskScope.transient,
        type: targetFixture,
      });
    });
  });

  describe('when called, with empty InjectableOptionsApi', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(InjectableOptionsApiFixtures.empty)
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.injectable,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      expect(reflectMetadata).toStrictEqual<TypeBinding>({
        bindingType: BindingType.type,
        id: targetFixture,
        scope: TaskScope.transient,
        type: targetFixture,
      });
    });
  });

  describe('when called, with InjectableOptionsApi with id', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(InjectableOptionsApiFixtures.withId)
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.injectable,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      expect(reflectMetadata).toStrictEqual<TypeBinding>({
        bindingType: BindingType.type,
        id: InjectableOptionsApiFixtures.withId.id as ServiceId,
        scope: TaskScope.transient,
        type: targetFixture,
      });
    });
  });

  describe('when called, with InjectableOptionsApi with scope', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(InjectableOptionsApiFixtures.withScope)
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.injectable,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedScope: TaskScope =
        taskScopeApiToTaskScopeMap[
          InjectableOptionsApiFixtures.withScope.scope as TaskScopeApi
        ];

      expect(reflectMetadata).toStrictEqual<TypeBinding>({
        bindingType: BindingType.type,
        id: targetFixture,
        scope: expectedScope,
        type: targetFixture,
      });
    });
  });
});
