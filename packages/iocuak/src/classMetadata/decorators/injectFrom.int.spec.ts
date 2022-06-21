import 'reflect-metadata';

import { inject } from '../../classMetadata/decorators/inject';
import { injectFrom } from '../../classMetadata/decorators/injectFrom';
import { ClassMetadata } from '../../classMetadata/models/domain/ClassMetadata';
import { getDefaultClassMetadata } from '../../classMetadata/utils/domain/getDefaultClassMetadata';
import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { getReflectMetadata } from '../../reflectMetadata/utils/domain/getReflectMetadata';
import { ClassElementMetadata } from '../models/domain/ClassElementMetadata';
import { ClassElementMetadataType } from '../models/domain/ClassElementMetadataType';

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
      let constructorArgumentServiceId: ServiceId;
      let propertyServiceId: ServiceId;

      let destinationType: Newable;

      beforeAll(() => {
        constructorArgumentServiceId = 'sample-param';
        propertyServiceId = 'sample-service';

        const baseType: Newable = class {};

        @injectFrom({
          extendConstructorArguments: extendConstructorArguments,
          extendProperties: extendProperties,
          type: baseType,
        })
        class DestinationType {
          @inject(propertyServiceId)
          public foo: unknown;

          constructor(
            @inject(constructorArgumentServiceId)
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
            constructorArguments: [
              {
                type: ClassElementMetadataType.serviceId,
                value: constructorArgumentServiceId,
              },
            ],
            properties: new Map([
              [
                'foo',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: propertyServiceId,
                },
              ],
            ]),
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
            const expectedConstructorArguments: ClassElementMetadata[] =
              new Array<ClassElementMetadata>(3);

            expectedConstructorArguments[1] = {
              type: ClassElementMetadataType.serviceId,
              value: 'barParam-param-child',
            };
            expectedConstructorArguments[2] = {
              type: ClassElementMetadataType.serviceId,
              value: 'bazParam-param-child',
            };

            const expectedBarPropertyMetadata: ClassElementMetadata = {
              type: ClassElementMetadataType.serviceId,
              value: 'bar-property-child',
            };

            const expectedBazPropertyMetadata: ClassElementMetadata = {
              type: ClassElementMetadataType.serviceId,
              value: 'baz-property-child',
            };

            expect(result).toStrictEqual<ClassMetadata>({
              constructorArguments: expectedConstructorArguments,
              properties: new Map([
                ['bar', expectedBarPropertyMetadata],
                ['baz', expectedBazPropertyMetadata],
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
            constructorArguments: [
              {
                type: ClassElementMetadataType.serviceId,
                value: 'sample-param',
              },
            ],
            properties: new Map([
              [
                'foo',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: 'sample-service',
                },
              ],
            ]),
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
            constructorArguments: [
              {
                type: ClassElementMetadataType.serviceId,
                value: 'sample-param',
              },
            ],
            properties: new Map([
              [
                'foo',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: 'sample-service',
                },
              ],
            ]),
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
              {
                type: ClassElementMetadataType.serviceId,
                value: 'fooParam-param-base',
              },
              {
                type: ClassElementMetadataType.serviceId,
                value: 'barParam-param-child',
              },
              {
                type: ClassElementMetadataType.serviceId,
                value: 'bazParam-param-child',
              },
            ],
            properties: new Map([
              [
                'foo',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: 'foo-property-base',
                },
              ],
              [
                'bar',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: 'bar-property-child',
                },
              ],
              [
                'baz',
                {
                  type: ClassElementMetadataType.serviceId,
                  value: 'baz-property-child',
                },
              ],
            ]),
          });
        });
      });
    });
  });
});
