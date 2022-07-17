import 'reflect-metadata';

import { beforeAll, describe, expect, it } from '@jest/globals';

import { Newable, Tag } from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataType,
  ClassMetadata,
  MetadataKey,
} from '@cuaklabs/iocuak-metadata';

import { injectTag } from './injectTag';

describe(injectTag.name, () => {
  describe('when called, as property decorator', () => {
    let bindingTagFixture: Tag;
    let targetFixture: Newable;

    let reflectMetadata: unknown;

    beforeAll(() => {
      bindingTagFixture = 'service-id';

      class TargetFixture {
        @injectTag(bindingTagFixture)
        public foo: string | undefined;
      }

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.inject,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedClassMetadata: ClassMetadata = {
        constructorArguments: [],
        properties: new Map([
          [
            'foo',
            {
              type: ClassElementMetadataType.tag,
              value: bindingTagFixture,
            },
          ],
        ]),
      };

      expect(reflectMetadata).toStrictEqual(expectedClassMetadata);
    });
  });

  describe('when called, as a constructor parameter decorator', () => {
    let bindingTagFixture: Tag;
    let targetFixture: Newable;

    let reflectMetadata: unknown;

    beforeAll(() => {
      bindingTagFixture = 'service-id';

      class TargetFixture {
        constructor(
          @injectTag(bindingTagFixture) public foo: string | undefined,
        ) {}
      }

      targetFixture = TargetFixture;

      reflectMetadata = Reflect.getOwnMetadata(
        MetadataKey.inject,
        targetFixture,
      );
    });

    it('should set reflect metadata', () => {
      const expectedClassMetadata: ClassMetadata = {
        constructorArguments: [
          {
            type: ClassElementMetadataType.tag,
            value: bindingTagFixture,
          },
        ],
        properties: new Map(),
      };

      expect(reflectMetadata).toStrictEqual(expectedClassMetadata);
    });
  });

  describe('when called, as a method parameter decorator', () => {
    let result: unknown;

    beforeAll(() => {
      const bindingTagFixture: Tag = 'service-id';

      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        class TypeFixture {
          constructor(public foo: string | undefined) {}

          public someMethod(
            @injectTag(bindingTagFixture) foo: unknown,
          ): unknown {
            return foo;
          }
        }
      } catch (error: unknown) {
        result = error;
      }
    });

    it('should throw an error', () => {
      const expectedErrorPartial: Partial<Error> = {
        message:
          expect.stringContaining(`Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method`) as unknown as string,
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining(expectedErrorPartial),
      );
    });
  });
});
