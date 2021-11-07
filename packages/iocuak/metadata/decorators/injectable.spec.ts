import 'reflect-metadata';

import { BindingApiFixtures } from '../../binding/fixtures/api/BindingApiFixtures';
import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { MetadataKey } from '../models/domain/MetadataKey';
import { injectable } from './injectable';

describe(injectable.name, () => {
  describe('when called, with no bindingApi', () => {
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

  describe('when called, with empty bindingApi', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(BindingApiFixtures.empty)
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

  describe('when called, with bindingApi with id', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(BindingApiFixtures.withId)
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
        id: BindingApiFixtures.withId.id as ServiceId,
        scope: TaskScope.transient,
        type: targetFixture,
      });
    });
  });

  describe('when called, with bindingApi with scope', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(BindingApiFixtures.withScope)
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
        scope: BindingApiFixtures.withScope.scope as TaskScope,
        type: targetFixture,
      });
    });
  });
});
