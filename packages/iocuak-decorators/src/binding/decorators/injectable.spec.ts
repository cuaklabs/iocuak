import { beforeAll, describe, expect, it } from '@jest/globals';

import 'reflect-metadata';

import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import {
  bindingReflectKey,
  BindingScope,
  TypeBinding,
} from '@cuaklabs/iocuak-models';
import {
  BindingScopeApi,
  bindingScopeApiToBindingScopeMap,
} from '@cuaklabs/iocuak-models-api';

import { InjectableOptionsApiFixtures } from '../fixtures/api/InjectableOptionsApiFixtures';
import { TypeBindingFixtures } from '../fixtures/domain/TypeBindingFixtures';
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
        bindingReflectKey,
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
        bindingReflectKey,
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
        bindingReflectKey,
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
        bindingReflectKey,
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

  describe('when called, with InjectableOptionsApi with tags array', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(InjectableOptionsApiFixtures.withTags)
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        bindingReflectKey,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.any,
        id: targetFixture,
        scope: BindingScope.transient,
        tags: InjectableOptionsApiFixtures.withTags.tags as Tag[],
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
    });
  });

  describe('when called, with InjectableOptionsApi with tags tag', () => {
    let targetFixture: Newable;
    let reflectMetadata: unknown;

    beforeAll(() => {
      @injectable(InjectableOptionsApiFixtures.withTag)
      class TargetFixture {}

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        bindingReflectKey,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedReflectMetadata: TypeBinding = {
        ...TypeBindingFixtures.any,
        id: targetFixture,
        scope: BindingScope.transient,
        tags: [InjectableOptionsApiFixtures.withTag.tags as Tag],
        type: targetFixture,
      };

      expect(reflectMetadata).toStrictEqual(expectedReflectMetadata);
    });
  });
});
