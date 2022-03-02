import 'reflect-metadata';

import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { ClassMetadata } from '../models/domain/ClassMetadata';
import { MetadataKey } from '../models/domain/MetadataKey';
import { getReflectMetadata } from '../utils/getReflectMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';
import { inject } from './inject';
import { injectFrom } from './injectFrom';

describe(injectFrom.name, () => {
  describe('having a ClassMetadataExtensionApi with extendConstructorArguments false and extendProperties false', () => {
    let extendConstructorArguments: boolean;
    let extendProperties: boolean;

    beforeAll(() => {
      extendConstructorArguments = false;
      extendProperties = false;
    });

    describe('when called, having a source type with no metadata and a destination type with no metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        const baseType: Newable = class {};

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {}

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('when called, having a source type with no metadata and a destination type with metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        const baseType: Newable = class {};

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {
          @inject('sample-service')
          public foo: unknown;

          constructor(
            @inject('sample-param')
            public readonly fooParam: unknown,
          ) {}
        }

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return metadata', () => {
          expect(result).toStrictEqual<ClassMetadata>({
            constructorArguments: ['sample-param'],
            properties: new Map([['foo', 'sample-service']]),
          });
        });
      });
    });

    describe('when called, having a source type with metadata and a destination type with no metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        class BaseType {
          @inject('sample-service')
          public foo: unknown;

          constructor(
            @inject('sample-param')
            public readonly fooParam: unknown,
          ) {}
        }

        const baseType: Newable = BaseType;

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {}

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return metadata', () => {
          expect(result).toStrictEqual<ClassMetadata>(
            getDefaultClassMetadata(),
          );
        });
      });

      describe('when called, having a source type with metadata and a destination type with metadata', () => {
        let destinationType: Newable;

        beforeAll(() => {
          class BaseType {
            @inject('foo-property-base')
            public foo: unknown;

            @inject('bar-property-base')
            public bar: unknown;

            constructor(
              @inject('fooParam-param-base')
              public readonly fooParam: unknown,
              @inject('barParam-param-base')
              public readonly barParam: unknown,
            ) {}
          }

          const baseType: Newable = BaseType;

          @injectFrom({
            extendConstructorArguments: extendConstructorArguments,
            extendProperties: extendProperties,
            type: baseType,
          })
          class DestinationType {
            @inject('bar-property-child')
            public bar: unknown;

            @inject('baz-property-child')
            public baz: unknown;

            constructor(
              public readonly fooParam: unknown,
              @inject('barParam-param-child')
              public readonly barParam: unknown,
              @inject('bazParam-param-child')
              public readonly bazParam: unknown,
            ) {}
          }

          destinationType = DestinationType;
        });

        describe('when called getReflectMetadata', () => {
          let result: unknown;

          beforeAll(() => {
            result = getReflectMetadata(destinationType, MetadataKey.inject);
          });

          it('should return metadata', () => {
            const expectedConstructorArguments: ServiceId[] =
              new Array<ServiceId>(3);

            expectedConstructorArguments[1] = 'barParam-param-child';
            expectedConstructorArguments[2] = 'bazParam-param-child';

            expect(result).toStrictEqual<ClassMetadata>({
              constructorArguments: expectedConstructorArguments,
              properties: new Map([
                ['bar', 'bar-property-child'],
                ['baz', 'baz-property-child'],
              ]),
            });
          });
        });
      });
    });
  });

  describe('having a ClassMetadataExtensionApi with extendConstructorArguments true and extendProperties true', () => {
    let extendConstructorArguments: boolean;
    let extendProperties: boolean;

    beforeAll(() => {
      extendConstructorArguments = true;
      extendProperties = true;
    });

    describe('when called, having a source type with no metadata and a destination type with no metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        const baseType: Newable = class {};

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {}

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });
    });

    describe('when called, having a source type with no metadata and a destination type with metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        const baseType: Newable = class {};

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {
          @inject('sample-service')
          public foo: unknown;

          constructor(
            @inject('sample-param')
            public readonly fooParam: unknown,
          ) {}
        }

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return metadata', () => {
          expect(result).toStrictEqual<ClassMetadata>({
            constructorArguments: ['sample-param'],
            properties: new Map([['foo', 'sample-service']]),
          });
        });
      });
    });

    describe('when called, having a source type with metadata and a destination type with no metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        class BaseType {
          @inject('sample-service')
          public foo: unknown;

          constructor(
            @inject('sample-param')
            public readonly fooParam: unknown,
          ) {}
        }

        const baseType: Newable = BaseType;

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {}

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return metadata', () => {
          expect(result).toStrictEqual<ClassMetadata>({
            constructorArguments: ['sample-param'],
            properties: new Map([['foo', 'sample-service']]),
          });
        });
      });
    });

    describe('when called, having a source type with metadata and a destination type with metadata', () => {
      let destinationType: Newable;

      beforeAll(() => {
        class BaseType {
          @inject('foo-property-base')
          public foo: unknown;

          @inject('bar-property-base')
          public bar: unknown;

          constructor(
            @inject('fooParam-param-base')
            public readonly fooParam: unknown,
            @inject('barParam-param-base')
            public readonly barParam: unknown,
          ) {}
        }

        const baseType: Newable = BaseType;

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {
          @inject('bar-property-child')
          public bar: unknown;

          @inject('baz-property-child')
          public baz: unknown;

          constructor(
            public readonly fooParam: unknown,
            @inject('barParam-param-child')
            public readonly barParam: unknown,
            @inject('bazParam-param-child')
            public readonly bazParam: unknown,
          ) {}
        }

        destinationType = DestinationType;
      });

      describe('when called getReflectMetadata', () => {
        let result: unknown;

        beforeAll(() => {
          result = getReflectMetadata(destinationType, MetadataKey.inject);
        });

        it('should return metadata', () => {
          expect(result).toStrictEqual<ClassMetadata>({
            constructorArguments: [
              'fooParam-param-base',
              'barParam-param-child',
              'bazParam-param-child',
            ],
            properties: new Map([
              ['foo', 'foo-property-base'],
              ['bar', 'bar-property-child'],
              ['baz', 'baz-property-child'],
            ]),
          });
        });
      });
    });
  });
});
