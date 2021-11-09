import 'reflect-metadata';

import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { inject } from '../../../metadata/decorators/inject';
import { injectable } from '../../../metadata/decorators/injectable';
import { ContainerApi } from './ContainerApi';

describe(ContainerApi.name, () => {
  describe('.bind()', () => {
    describe('having a type with no metadata', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        let result: unknown;

        beforeAll(() => {
          containerApi = new ContainerApi();

          try {
            containerApi.bind(typeFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          expect(result).toBeInstanceOf(Error);
        });
      });
    });

    describe('having a type with binding metadata and no constructor metadata nor properties metadata', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        @injectable()
        class TypeFixture {
          public property!: string;

          constructor(public readonly parameter: string) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = new ContainerApi();

          containerApi.bind(typeFixture);
        });

        describe('when called .get()', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(typeFixture);
          });

          it('should return an instance with no properties set', () => {
            expect(result).toBeInstanceOf(typeFixture);
            expect(result).not.toHaveProperty('property');
          });
        });
      });
    });

    describe('having a type with binding metadata and constructor metadata and no properties metadata', () => {
      let parameterServiceIdFixture: ServiceId;
      let typeFixture: Newable;

      beforeAll(() => {
        parameterServiceIdFixture = 'sample-service';

        @injectable()
        class TypeFixture {
          public property: string | undefined;

          constructor(
            @inject(parameterServiceIdFixture)
            public readonly parameter: unknown,
          ) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = new ContainerApi();

          containerApi.bind(typeFixture);
        });

        describe('when called .bind() with dependent service', () => {
          let dependentTypeFixture: Newable;

          beforeAll(() => {
            @injectable({
              id: parameterServiceIdFixture,
            })
            class DependentTypeFixture {}

            dependentTypeFixture = DependentTypeFixture;

            containerApi.bind(dependentTypeFixture);
          });

          describe('when called .get()', () => {
            let result: unknown;

            beforeAll(() => {
              result = containerApi.get(typeFixture);
            });

            it('should return an instance', () => {
              expect(result).toStrictEqual(
                new typeFixture(new dependentTypeFixture()),
              );
            });
          });
        });

        describe('when called .get()', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(typeFixture);
          });

          it('should return an instance', () => {
            expect(result).toBeInstanceOf(typeFixture);
          });
        });
      });
    });

    describe('having a type with binding metadata and constructor metadata and properties metadata', () => {
      let parameterServiceIdFixture: ServiceId;
      let propertyServiceIdFixture: ServiceId;
      let typeFixture: Newable;

      beforeAll(() => {
        parameterServiceIdFixture = 'sample-parameter-service';
        propertyServiceIdFixture = 'sample-property-service';

        @injectable()
        class TypeFixture {
          @inject(propertyServiceIdFixture)
          public property: unknown;

          constructor(
            @inject(parameterServiceIdFixture)
            public readonly parameter: unknown,
          ) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = new ContainerApi();

          containerApi.bind(typeFixture);
        });

        describe('when called .bind() on type dependencies', () => {
          let parameterTypeFixture: Newable;
          let propertyTypeFixture: Newable;

          beforeAll(() => {
            @injectable({
              id: parameterServiceIdFixture,
            })
            class ParameterTypeFixture {}

            @injectable({
              id: propertyServiceIdFixture,
            })
            class PropertyTypeFixture {}

            parameterTypeFixture = ParameterTypeFixture;
            propertyTypeFixture = PropertyTypeFixture;

            containerApi.bind(parameterTypeFixture);
            containerApi.bind(propertyTypeFixture);
          });

          describe('when called .get()', () => {
            let result: unknown;

            beforeAll(() => {
              result = containerApi.get(typeFixture);
            });

            it('should return an instance', () => {
              const expected: unknown = new typeFixture(
                new parameterTypeFixture(),
              );

              (expected as Record<string, unknown>)['property'] =
                new propertyTypeFixture();

              expect(result).toStrictEqual(expected);
            });
          });
        });
      });
    });
  });

  describe('.bindToValue()', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let valueFixture: unknown;

      let containerApi: ContainerApi;

      beforeAll(() => {
        serviceIdFixture = 'service-id';
        valueFixture = {
          foo: 'bar',
        };

        containerApi = new ContainerApi();

        containerApi.bindToValue(serviceIdFixture, valueFixture);
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerApi.get(serviceIdFixture);
        });

        it('should return the value binded', () => {
          expect(result).toBe(valueFixture);
        });
      });
    });
  });
});
