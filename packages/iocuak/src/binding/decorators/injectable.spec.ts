import 'reflect-metadata';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { InjectableOptionsApiFixtures } from '../fixtures/api/InjectableOptionsApiFixtures';
import { TypeBindingFixtures } from '../fixtures/domain/TypeBindingFixtures';
import { BindingScopeApi } from '../models/api/BindingScopeApi';
import { bindingScopeApiToBindingScopeMap } from '../models/api/bindingScopeApiToBindingScopeMap';
import { BindingScope } from '../models/domain/BindingScope';
import { TypeBinding } from '../models/domain/TypeBinding';
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
      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.withScopeTransientAndTagsEmpty,
        id: targetFixture,
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
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
      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.withScopeTransientAndTagsEmpty,
        id: targetFixture,
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
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
      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.withScopeTransientAndTagsEmpty,
        id: InjectableOptionsApiFixtures.withId.id as ServiceId,
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
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
      const expectedScope: BindingScope =
        bindingScopeApiToBindingScopeMap[
          InjectableOptionsApiFixtures.withScope.scope as BindingScopeApi
        ];

      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.withTagsEmpty,
        id: targetFixture,
        scope: expectedScope,
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
    });
  });
});
